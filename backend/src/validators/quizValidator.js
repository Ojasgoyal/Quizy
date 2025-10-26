import Joi from "joi";

export const quizSchema = Joi.object({
  title: Joi.string().allow("").default("Untitled Quiz"),
  description: Joi.string().allow("").default(""),
  questions: Joi.array()
    .max(20)
    .items(
      Joi.object({
        question: Joi.string().allow("").default(""), // Allow empty question
        type: Joi.string().valid("scq", "mcq").default("scq"),
        options: Joi.array()
          .min(2) // Ensure at least 2 options
          .max(4) // Maximum 4 options
          .items(
            Joi.object({
              text: Joi.string().allow("").default(""), // Allow empty option text
              isCorrect: Joi.boolean().default(false),
            })
          )
          .default([
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ]), // Default to 2 empty options
      })
    )
    .default([
      {
        question: "",
        type: "scq",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]), // Default to 1 question with 2 empty options
});