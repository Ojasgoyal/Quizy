import { useClerk } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
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
      await axios.put(
        `${apiUrl}/edit/quiz/${quizId}`,
        formattedQuiz,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSaving(false);
      alert("Quiz saved successfully!");
    } catch (err) {
      console.error(err);
      setSaving(false);
      alert("Failed to save quiz.");
    }
  };

  const addQuestion = () => {
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
  };

  const updateQuestion = (index, updatedQuestion) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = updatedQuestion;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200">
      {/* Title and Description */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <input
            type="text"
            className="input input-ghost text-2xl font-semibold w-full"
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
        <textarea
          className="textarea textarea-bordered w-full mt-4"
          placeholder="Quiz description (optional)"
          value={quiz.description}
          onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
        />
      </div>

      {/* Questions */}
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {quiz.questions.map((question, index) => (
          <div key={index} className="card bg-base-100 shadow-md relative">
            <div className="card-body">
              {/* Question Text */}
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder={`Question ${index + 1}`}
                value={question.question}
                onChange={(e) =>
                  updateQuestion(index, { ...question, question: e.target.value })
                }
              />

              {/* Options */}
              <div className="mt-4 space-y-2">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <input
                      type={question.type === "scq" ? "radio" : "checkbox"}
                      className="checkbox"
                      checked={option.isCorrect}
                      onChange={() => {
                        const updatedOptions = question.options.map((opt, i) =>
                          question.type === "scq"
                            ? { ...opt, isCorrect: i === optIndex }
                            : i === optIndex
                            ? { ...opt, isCorrect: !opt.isCorrect }
                            : opt
                        );
                        updateQuestion(index, { ...question, options: updatedOptions });
                      }}
                    />
                    <input
                      type="text"
                      className="input input-bordered flex-1"
                      placeholder={`Option ${optIndex + 1}`}
                      value={option.text}
                      onChange={(e) => {
                        const updatedOptions = question.options.map((opt, i) =>
                          i === optIndex ? { ...opt, text: e.target.value } : opt
                        );
                        updateQuestion(index, { ...question, options: updatedOptions });
                      }}
                    />
                  </div>
                ))}
                {/* Add Option */}
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() =>
                    updateQuestion(index, {
                      ...question,
                      options: [...question.options, { text: "", isCorrect: false }],
                    })
                  }
                  disabled={question.options.length >= 4}
                >
                  Add Option
                </button>
              </div>
            </div>

            {/* Question Type Dropdown */}
            <div className="absolute top-4 right-4">
              <select
                className="select select-bordered"
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
            <div className="absolute bottom-4 right-4">
              <button
                className="btn btn-error btn-sm"
                onClick={() => deleteQuestion(index)}
                title="Delete Question"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {/* Add Question */}
        <div className="flex justify-center">
          <button className="btn btn-accent" onClick={addQuestion}>
            <Plus size={18} />
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
}