import Joi from "joi";

export const quizSchema = Joi.object({
  title: Joi.string().allow("").default("Untitled Quiz"),
  description: Joi.string().allow(""),
  questions: Joi.array()
    .max(20)
    .items(
      Joi.object({
        question: Joi.string().allow("").default(""), // draft-friendly
        type: Joi.string().valid("scq", "mcq").default("scq"),
        options: Joi.array()
          .max(4)
          .items(
            Joi.object({
              text: Joi.string().allow("").default(""), // draft-friendly
              isCorrect: Joi.boolean().default(false),
            })
          )
          .default([]), // allow empty options
      })
    )
    .default([]), // allow empty quiz
});