import React, { useEffect, useState } from "react";
import axios from "axios";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { Trash, Share2 } from "lucide-react";

export default function Dashboard() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const clerk = useClerk();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

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

  const handleDelete = async (e, quizId) => {
    const ok = window.confirm("Delete this Quiz?");
    if (!ok) return;

    try {
      const token = await clerk.session.getToken();

      await axios.delete(`${apiUrl}/delete/quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
    } catch (error) {
      console.error("Delete Failed:", error);
      alert("Failed to delete quiz. Try again.");
    }
  };

  const handleCopyLink = (quizId) => {
    const playLink = `${window.location.origin}/play/quiz/${quizId}`;
    navigator.clipboard.writeText(playLink).then(() => {
      setCopied(quizId);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const formatDate = (iso) => {
    if (!iso) return "N/A";
    const d = new Date(iso);
    if (isNaN(d)) return "N/A";
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
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
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/generate")}
              className="btn btn-md text-gray-100 bg-gradient-to-tl from-primary via-purple-400 to-rose-400 px-4 py-2
             relative overflow-hidden group transition-transform duration-300 hover:scale-[1.03]"
            >
              <span
                className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/40 to-white/10
                   opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></span>
              Generate with AI
            </button>
            <button
              onClick={handleCreateQuiz}
              className="btn btn-primary px-4 py-2"
            >
              Create
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 p-6 overflow-y-auto">
          {!loading &&
            (quizzes.length === 0 ? (
              <div className="w-full flex items-center justify-center">
                <p>No quizzes created yet.</p>
              </div>
            ) : (
              quizzes.map((quiz) => (
                <Link
                  key={quiz._id}
                  to={`/quiz/edit/${quiz._1d ?? quiz._id}`} // keep existing id usage
                  className="no-underline"
                  onClick={(e) => {
                    // Prevent navigation if the delete button is clicked
                    if (e.target.closest("button")) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div
                    key={quiz._id}
                    className="relative cursor-pointer w-36 md:w-64 h-30 md:h-40 border-0 rounded-xl p-4 hover:shadow-lg transition-all duration-300 flex flex-col bg-gradient-to-b from-primary to-accent justify-between"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the click from bubbling to the Link
                        e.nativeEvent?.stopImmediatePropagation(); // Prevent immediate bubbling
                        e.preventDefault();
                        handleDelete(e, quiz._id);
                      }}
                      className="absolute btn btn-xs md:btn-sm bottom-2 left-2 
md:top-2 md:right-2 md:bottom-auto md:left-auto
z-20 p-2 rounded-md shadow-md bg-rose-500 hover:bg-rose-600
transition-transform duration-150 hover:scale-105 cursor-pointer
border-0 focus:outline-none w-auto inline-flex justify-center items-center"

                      aria-label="Delete quiz"
                    >
                      <Trash size={16} className="text-white" />
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        e.nativeEvent?.stopImmediatePropagation();
                        handleCopyLink(quiz._id);
                      }}
                      className="absolute bottom-2 right-2 z-20 btn btn-xs md:btn-sm p-2 rounded-md shadow-md bg-blue-500 hover:bg-blue-600 hover:shadow-lg transition-transform duration-150 hover:scale-105 cursor-pointer border-0 focus:outline-none"
                      aria-label="Share quiz"
                    >
                      <Share2 size={16} className="text-white" />
                    </button>

                    {/* Copied Message */}
                    {copied === quiz._id && (
                      <div className="absolute bottom-10 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow-md">
                        Copied!
                      </div>
                    )}

                    <div className="flex items-start gap-2 pr-8">
                      <h2 className="font-semibold text-gray-100 text-xs md:text-lg truncate">
                        {quiz.title || "Untitled Quiz"}
                      </h2>
                    </div>

                    <p className="hidden md:block text-sm text-gray-100">
                      {formatDate(quiz.updatedAt)}
                    </p>
                  </div>
                </Link>
              ))
            ))}
        </div>
      </div>
    </>
  );
}
