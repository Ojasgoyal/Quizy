import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Quiz } from "../../../backend/src/models/quiz";

export default function Player() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const { quizId } = useParams();
  const { isSignedIn, user } = useUser();

  const [quiz, setQuiz] = useState(null);
  const [playerName, setPlayerName] = useState("");

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
  };

  const attempt = {
    quizId,
    playerName,
    playerClerkId: isSignedIn ? user.id : null,
    answers: [],
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="min-h-screen -mt-20 flex flex-col justify-center items-center">
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
      </div>
    </>
  );
}
