import { useClerk } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"

export default function QuizBuilder() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL
  const { quizId } = useParams();
  const clerk = useClerk();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    if (!clerk.session) return;

    const fetchQuiz = async () => {
      try {
        const token = await clerk.session.getToken();
        const res = await axios.get(
          `${apiUrl}/quiz/${quizId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuiz(res.data.data);
      } catch (err) {
        if (err.response?.status === 403 || err.response?.status === 404) navigate("/create");
        else console.error(err);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (!quiz) return <div>Loading...</div>;

  return (
    <>
    <div>
      <h1>{quiz.title || "Untitled Quiz"}</h1>
      {/* Render questions here */}
    </div>
    </>
  );
}
