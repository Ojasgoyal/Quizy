import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useClerk, useUser } from "@clerk/clerk-react";

export default function Results() {
  const clerk = useClerk();
  const {isSignedIn} = useUser()
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const headers = {};
        if (isSignedIn) {
          const token = await clerk.session.getToken(); // Get the Clerk session token
          headers.Authorization = `Bearer ${token}`; // Include the token in the Authorization header
        }

        const { data } = await axios.get(
          `${apiUrl}/attempts/${attemptId}`,
          { headers } // Pass headers conditionally
        );
        setAttempt(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAttempt();
  }, [attemptId]);

  if (!attempt) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">{attempt.quizId.title}</h1>
      <p className="text-xl mb-4">
        Player: <span className="font-bold">{attempt.playerName}</span>
      </p>
      <p className="text-xl mb-4">
        Score: <span className="font-bold">{attempt.score}</span> out of{" "}
        <span className="font-bold">{attempt.answers.length}</span>
      </p>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        {attempt.quizId.questions.map((question, index) => {
          const userAnswer = attempt.answers.find(
            (ans) => ans.questionId.toString() === question._id.toString()
          );
          return (
            <div key={index} className="mb-4">
              <h2 className="text-lg font-bold">{question.question}</h2>
              <p
                className={`text-md ${
                  userAnswer?.isCorrect ? "text-green-600" : "text-red-600"
                }`}
              >
                Your Answer:{" "}
                {question.options.find(
                  (option) =>
                    option._id.toString() ===
                    userAnswer?.answerGiven?.toString()
                )?.text || "No Answer"}
              </p>
              {!userAnswer?.isCorrect && (
                <p className="text-md text-blue-600">
                  Correct Answer:{" "}
                  {question.options.find((option) => option.isCorrect)?.text}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <button
        className="btn btn-primary mt-6"
        onClick={() => navigate("/results")}
      >
        Back to Results Dashboard
      </button>
    </div>
  );
}
