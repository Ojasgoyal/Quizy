import React, { useEffect, useState } from "react";
import axios from "axios";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const clerk = useClerk();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCreateQuiz = async () => {
    try {
      const token = await clerk.session.getToken();

      const res = await axios.post(
        `${apiUrl}/create`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { data } = res.data;
      const quizId = data._id.toString();

      navigate(`/quiz/edit/${quizId}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!clerk.session) return;

    const fetchQuizzes = async () => {
      try {
        const token = await clerk.session.getToken();
        const res = await axios.get(`${apiUrl}/userquizzes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { data } = res.data;
        setTimeout(() => {
          setQuizzes(data);
          setLoading(false);
        }, 100);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [clerk.session]);

  return (
    <>
      <div className="flex flex-col h-screen w-full p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My Quizzes</h2>
          <button
            onClick={handleCreateQuiz}
            className="btn btn-primary px-4 py-2"
          >
            Create
          </button>
        </div>
        <div className="flex flex-wrap gap-6 p-6 overflow-y-auto">
          {!loading &&
            (quizzes.length === 0 ? (
              <div className="w-full flex items-center justify-center">
                <p>No quizzes created yet.</p>
              </div>
            ) : (
              quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  onClick={() => navigate(`/quiz/edit/${quiz._id}`)}
                  className="cursor-pointer w-64 h-40 border rounded-xl p-4 hover:shadow-lg transition-all duration-300 flex flex-col bg-gradient-to-br from-primary to-accent justify-between"
                >
                  <h2 className="font-semibold text-gray-100 text-lg truncate">
                    {quiz.title || "Untitled Quiz"}
                  </h2>
                  <p className="text-sm text-gray-100">
                    {quiz.updatedAt
                      ? new Date(quiz.updatedAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              ))
            ))}
        </div>
      </div>
    </>
  );
}
