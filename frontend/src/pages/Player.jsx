import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Question from "../components/Player/Question";

export default function Player() {
  const clerk = useClerk();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const { quizId } = useParams();
  const { isSignedIn, user } = useUser();

  const [quiz, setQuiz] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [playing, setPlaying] = useState(false);
  const [quesIndex, setQuesIndex] = useState(0);
  const [attempt, setAttempt] = useState({
    quizId,
    playerName: "",
    playerClerkId: null,
    answers: [],
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/play/${quizId}`);
        setQuiz(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (isSignedIn && user) {
      setPlayerName(`${user.firstName} ${user.lastName}`);
    }
  }, [isSignedIn, user]);

  const handlePlay = () => {
    if (!playerName.trim()) {
      alert("Name is required to play the quiz.");
      return;
    }

    setAttempt((prev) => ({
      ...prev,
      playerName,
      playerClerkId: isSignedIn ? user.id : null,
    }));

    setPlaying(true);
  };

  const handleNext = () => {
    if (quesIndex < quiz.questions.length - 1) {
      setQuesIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (quesIndex > 0) {
      setQuesIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const headers = {};
      if (isSignedIn) {
        const token = await clerk.session.getToken();
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.post(
        `${apiUrl}/play/${quizId}/submit`,
        attempt,
        { headers }
      );
      const { attemptData, totalQuestions } = response.data.data;
      const { _id, score } = attemptData;
      navigate(`/quiz/${quizId}/${_id}/results`, {
        state: { score, totalQuestions },
      });
    } catch (error) {
      console.error(error);
      alert("Failed to submit quiz");
    }
  };

  const handleAnswerSelect = (questionId, optionId) => {
    setAttempt((prev) => {
      const updatedAnswers = prev.answers.filter(
        (ans) => ans.questionId !== questionId
      );
      updatedAnswers.push({ questionId, markedAnswerId: optionId });
      return { ...prev, answers: updatedAnswers };
    });
  };

  if (!quiz) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col justify-center items-center p-4">
      {playing ? (
        <div className="card shadow-md bg-gradient-to-bl from-primary/90 to-secondary/90 p-6 w-full max-w-3xl space-y-6">
          <h1 className="text-2xl md:text-4xl font-bold text-white text-center">
            {quiz.title}
          </h1>
          <Question
            question={quiz.questions[quesIndex]}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={
              attempt.answers.find(
                (ans) => ans.questionId === quiz.questions[quesIndex]._id
              )?.markedAnswerId
            }
          />

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={quesIndex === 0}
            >
              Previous
            </button>
            {quesIndex < quiz.questions.length - 1 ? (
              <button className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button className="btn btn-success" onClick={handleSubmit}>
                Submit
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="card shadow-md bg-gradient-to-bl from-primary/90 to-secondary/90 p-6 w-full max-w-md space-y-6">
          <h1 className="text-2xl md:text-4xl font-bold text-white text-center">
            {quiz.title}
          </h1>
          <p className="text-gray-200 text-center">{quiz.description}</p>

          <div className="form-control w-full text-center">
            <label htmlFor="playerName" className="label">
              <span className="label-text label-text text-md text-gray-200 my-2 ">Playing as</span>
            </label>
            <input
              type="text"
              id="playerName"
              placeholder="Enter Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="input input-bordered mt-3 bg-transparent focus:outline-none text-white w-full disabled:bg-transparent disabled:border-gray-600 disabled:text-gray-300"
              disabled={isSignedIn}
            />
          </div>

          <button
            className="btn btn-primary w-full"
            onClick={handlePlay}
          >
            Start Quiz
          </button>
        </div>
      )}
    </div>
  );
}