import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useClerk } from "@clerk/clerk-react";

export default function ResultsDashboard() {
  const clerk = useClerk();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const token = await clerk.session.getToken();
        const { data } = await axios.get(`${apiUrl}/attempts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAttempts(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [clerk.session]);

  if (loading) return <div>Loading...</div>;

  const groupedAttempts = attempts.reduce((acc, attempt) => {
    const quizId = attempt.quizId._id;
    if (!acc[quizId]) {
      acc[quizId] = {
        quizTitle: attempt.quizId.title,
        quizDescription: attempt.quizId.description,
        attempts: [],
      };
    }
    acc[quizId].attempts.push(attempt);
    return acc;
  }, {});

  return (
<div className="min-h-screen flex flex-col items-center p-8 bg-base-100">
  <h1 className="text-3xl font-bold mb-8 text-primary text-center">
    Your Quiz Attempts
  </h1>

  <div className="w-full flex flex-wrap justify-center gap-6">
    {Object.keys(groupedAttempts).map((quizId) => (
      <div
        key={quizId}
        className="w-[380px] bg-base-200 rounded-xl shadow-md p-6"
      >
        <h2 className="text-lg font-semibold text-base-content">
          {groupedAttempts[quizId].quizTitle}
        </h2>
        <p className="text-sm text-base-content/70 mt-1">
          {groupedAttempts[quizId].quizDescription}
        </p>

        <div className="mt-4 border-t border-base-300 pt-3 space-y-3">
          {groupedAttempts[quizId].attempts.map((attempt) => (
            <div
              key={attempt._id}
              onClick={() =>
                navigate(`/quiz/${quizId}/${attempt._id}/results`)
              }
              className="p-3 rounded-lg bg-base-100 border border-base-300 cursor-pointer hover:bg-base-200 transition-colors"
            >
              <p className="font-medium">
                Score: {attempt.score}/{attempt.answers.length}
              </p>
              <p className="text-sm text-base-content/70">
                {new Date(attempt.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
</div>

  );
}
