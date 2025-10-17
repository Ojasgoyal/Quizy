import mongoose, { Schema } from "mongoose"

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
})

const questionSchema = new Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ["scq", "mcq"], required: true },
  options: {
    type: [optionSchema],
    validate: {
      validator: function (v) {
        return v.length <= 4;
      },
      message: "A question can have a maximum of 4 options.",
    },
  },
})

const quizSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    creatorClerkId: { type: String, required: true },
    questions: {
      type: [questionSchema],
      validate: {
        validator: function (v) {
          return v.length <= 20;
        },
        message: "A quiz can have a maximum of 20 questions.",
      },
    },
  },
  { timestamps: true }
)

export const quiz = mongoose.model("Quiz", quizSchema)
