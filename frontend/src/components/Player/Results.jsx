import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, totalQuestions } = location.state || { score: 0, totalQuestions: 0 };

  return (
    <div className="min-h-screen -mt-20 flex flex-col justify-center items-center">
      <div className="card shadow-md bg-gradient-to-bl from-primary/90 to-secondary/90 p-8 text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Quiz Results</h1>
        <p className="text-gray-200 text-lg">
          You scored <span className="font-bold">{score}</span> out of{" "}
          <span className="font-bold">{totalQuestions}</span>.
        </p>
        <button
          className="btn btn-primary mt-6"
          onClick={() => navigate("/")}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}