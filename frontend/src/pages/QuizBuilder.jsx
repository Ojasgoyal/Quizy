import { useClerk } from "@clerk/clerk-react";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Trash2, Plus } from "lucide-react";

export default function QuizBuilder() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const { quizId } = useParams();
  const clerk = useClerk();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    questions: [
      {
        question: "",
        type: "scq",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!clerk.session) return;

    const fetchQuiz = async () => {
      try {
        const token = await clerk.session.getToken();
        const res = await axios.get(`${apiUrl}/quiz/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuiz(res.data.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 403 || err.response?.status === 404) {
          // Redirect to create a new quiz if not found
          setQuiz({
            title: "",
            description: "",
            questions: [
              {
                question: "",
                type: "scq",
                options: [
                  { text: "", isCorrect: false },
                  { text: "", isCorrect: false },
                ],
              },
            ],
          });
          setLoading(false);
        } else {
          console.error(err);
        }
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await clerk.session.getToken();
      const formattedQuiz = {
        title: quiz.title.trim(),
        description: quiz.description.trim(),
        questions: quiz.questions.map((q) => ({
          question: q.question.trim(),
          type: q.type,
          options: q.options.map((opt) => ({
            text: opt.text.trim(),
            isCorrect: opt.isCorrect,
          })),
        })),
      };
      await axios.put(`${apiUrl}/edit/quiz/${quizId}`, formattedQuiz, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSaving(false);
      alert("Quiz saved successfully!");
    } catch (err) {
      console.error(err);
      setSaving(false);
      alert("Failed to save quiz.");
    }
  };

  const bottomRef = useRef(null);

  const addQuestion = () => {
    if (quiz.questions.length >= 20) {
      alert("Maximum of 20 questions allowed.");
      return;
    }
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          question: "",
          type: "scq",
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ],
    });

    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      } else {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 80);
  };

  const updateQuestion = (index, updatedQuestion) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = updatedQuestion;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const deleteQuestion = (index) => {
    if (index === 0) return;
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const deleteOption = (qIndex, oIndex) => {
    setQuiz((prev) => {
      const questions = prev.questions.slice();
      const q = { ...questions[qIndex] };
      // guard: keep at least 2 options
      if ((q.options?.length ?? 0) <= 2) return prev;
      q.options = q.options.filter((_, i) => i !== oIndex);
      // for SCQ ensure at least one correct remains
      if (q.type === "scq" && !q.options.some((o) => o.isCorrect)) {
        q.options[0].isCorrect = true;
      }
      questions[qIndex] = q;
      return { ...prev, questions };
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen mb-6">
      {/* Title and Description */}
      <div className="sticky top-0 z-10 pb-2 bg-base-100/90 backdrop-blur-sm rounded-md ">
        <div className="max-w-5xl mx-auto px-4 pt-3">
          <div className="flex gap-2 justify-between items-center">
            <input
              type="text"
              className="input input-ghost text-2xl font-semibold w-full focus:outline-none"
              placeholder="Untitled Quiz"
              value={quiz.title}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            />
            <button
              className={`btn btn-primary ${saving ? "btn-disabled" : ""}`}
              onClick={handleSave}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 pb-6">
        <textarea
          className="textarea textarea-ghost focus:outline-none w-full mt-4"
          placeholder="Quiz description (optional)"
          value={quiz.description}
          onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
        />
      </div>

      {/* Questions */}
      <div className=" max-w-5xl mx-auto px-4 space-y-6">
        {quiz.questions.map((question, index) => (
          <div key={index} className="card bg-secondary/5 shadow-md relative">
            <div className="card-body">
              {/* Question Text */}
              <input
                name={`Question ${index + 1}`}
                type="text"
                className="w-[90%] max-w-4xl input bg-transparent input-bordered focus:outline-none"
                placeholder={`Question ${index + 1}`}
                value={question.question}
                onChange={(e) =>
                  updateQuestion(index, {
                    ...question,
                    question: e.target.value,
                  })
                }
              />

              {/* Options */}
              <div className="mt-4 space-y-2">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <input
                      type={question.type === "scq" ? "radio" : "checkbox"}
                      name={question.type === "scq" ? `q-${index}` : undefined}
                      className="checkbox checkbox-sm checkbox-accent"
                      checked={option.isCorrect}
                      onChange={() => {
                        const updatedOptions = question.options.map((opt, i) =>
                          question.type === "scq"
                            ? { ...opt, isCorrect: i === optIndex }
                            : i === optIndex
                            ? { ...opt, isCorrect: !opt.isCorrect }
                            : opt
                        );
                        updateQuestion(index, {
                          ...question,
                          options: updatedOptions,
                        });
                      }}
                    />
                    <input
                      type="text"
                      className="input bg-transparent focus:outline-none flex-1"
                      placeholder={`Option ${optIndex + 1}`}
                      value={option.text}
                      onChange={(e) => {
                        const updatedOptions = question.options.map((opt, i) =>
                          i === optIndex
                            ? { ...opt, text: e.target.value }
                            : opt
                        );
                        updateQuestion(index, {
                          ...question,
                          options: updatedOptions,
                        });
                      }}
                    />
                    <button
                      onClick={() => deleteOption(index, optIndex)}
                      className="btn btn-ghost btn-sm p-1 ml-2"
                      disabled={question.options.length <= 2}
                      title={
                        question.options.length <= 2
                          ? "At least 2 options required"
                          : "Delete option"
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {/* Add Option */}
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() =>
                    updateQuestion(index, {
                      ...question,
                      options: [
                        ...question.options,
                        { text: "", isCorrect: false },
                      ],
                    })
                  }
                  disabled={question.options.length >= 4}
                >
                  Add Option
                </button>
              </div>
            </div>

            {/* Question Type Dropdown */}
            <div className="absolute top-0 md:top-4 right-0 md:right-4">
              <select
                className="select w-fit focus:outline-none"
                value={question.type}
                onChange={(e) =>
                  updateQuestion(index, { ...question, type: e.target.value })
                }
              >
                <option value="scq">SCQ</option>
                <option value="mcq">MCQ</option>
              </select>
            </div>

            {/* Delete Question */}
            {index !== 0 && (
              <div className="absolute bottom-4 right-4">
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => deleteQuestion(index)}
                  title="Delete Question"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add Question */}
        <div className="flex justify-center">
          <button
            disabled={quiz.questions.length >= 20}
            className={`btn btn-accent ${
              quiz.questions.length >= 20
                ? "btn-disabled cursor-not-allowed opacity-60"
                : ""
            }`}
            onClick={addQuestion}
            title={
              quiz.questions.length >= 20
                ? "Maximum of 20 questions reached"
                : "Add Question"
            }
          >
            <Plus size={18} />
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
}
