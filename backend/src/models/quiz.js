import mongoose, { Schema } from "mongoose"
import { Attempt } from "./attempt.js";

const optionSchema = new mongoose.Schema({
  text: { type: String },
  isCorrect: { type: Boolean, default: false },
})

const questionSchema = new Schema({
  question: { type: String },
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

quizSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Attempt.deleteMany({ quizId: doc._id });
    console.log(`Deleted all attempts for quiz: ${doc._id}`);
  }
})

export const Quiz = mongoose.model("Quiz", quizSchema)
