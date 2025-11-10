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

  // Handle "Previous" button click
  const handlePrevious = () => {
    if (quesIndex > 0) {
      setQuesIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Handle "Submit" button click
const handleSubmit = async () => {
  try {
    const headers = {};
    if (isSignedIn) {
      const token = await clerk.session.getToken(); // Get the Clerk session token
      headers.Authorization = `Bearer ${token}`; // Include the token in the Authorization header
    }

    const response = await axios.post(
      `${apiUrl}/play/${quizId}/submit`,
      attempt,
      { headers } // Pass headers conditionally
    );
    const { attemptData, totalQuestions } = response.data.data;
    const { _id ,  score } = attemptData;
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
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="h-[calc(100vh-80px)] flex flex-col justify-center items-center">
        {playing ? (
          <div className="card shadow-md bg-gradient-to-bl from-primary/90 to-secondary/90 p-8 w-5xl text-center space-y-4 flex justify-center items-center">
            <h1 className="text-4xl font-bold text-white">{quiz.title}</h1>
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
            <div className="w-full flex justify-between mt-6">
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
          <div className="card shadow-md bg-gradient-to-bl from-primary/90 to-secondary/90 p-8 text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">{quiz.title}</h1>
            <p className="text-gray-200">{quiz.description}</p>

            <div className="form-control w-full max-w-xs mt-10 mx-auto">
              <label htmlFor="playerName" className="label">
                <span className="label-text text-md text-gray-200">
                  Playing as
                </span>
              </label>
              <input
                type="text"
                id="playerName"
                placeholder="Enter Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="mt-3 input bg-transparent focus:outline-none text-white w-full disabled:bg-transparent disabled:border-gray-600 disabled:text-gray-300"
                disabled={isSignedIn}
              />
            </div>

            <button
              className="btn btn-primary w-full max-w-xs mx-auto"
              onClick={handlePlay}
            >
              Play
            </button>
          </div>
        )}
      </div>
    </>
  );
}
