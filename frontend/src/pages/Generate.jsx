import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useClerk } from "@clerk/clerk-react";

export default function GenerateQuiz() {
  const clerk = useClerk();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [type, setType] = useState("scq");
  const [loading, setLoading] = useState(false);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await clerk.session.getToken();

      const response = await axios.post(
        `${apiUrl}/aiquiz/generate`,
        {
          prompt,
          numQuestions,
          difficulty,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      const { quizId } = response.data.data;
      navigate(`/quiz/edit/${quizId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-base-100 relative">
      {/* 🔥 Loading Overlay (correct placement — OUTSIDE the button) */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="p-6 bg-base-100 rounded-xl shadow-xl text-center">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-4 font-semibold text-lg">
              Generating your quiz...
            </p>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Generate Quiz with AI</h1>

      <form onSubmit={handleGenerateQuiz} className="w-full max-w-md space-y-4">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Enter prompt (e.g., JavaScript basics)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />

        <input
          type="number"
          className="input input-bordered w-full"
          placeholder="Number of questions"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
          min={1}
          max={20}
          required
        />

        <select
          className="select select-bordered w-full"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          className="select select-bordered w-full"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="scq">SCQ</option>
          <option value="mcq">MCQ</option>
        </select>

        <button
          type="submit"
          className={`btn btn-primary w-full ${loading ? "btn-disabled" : ""}`}
        >
          {loading ? "Generating..." : "Generate Quiz"}
        </button>
      </form>
    </div>
  );
}
