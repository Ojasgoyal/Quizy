import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
});
import OpenAI from "openai";
import { Quiz } from "../models/quiz.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { getAuth } from "@clerk/express";


export const generateQuiz = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req)

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const { prompt, numQuestions, difficulty, type } = req.body;

    if (!prompt || prompt.length < 3 || prompt.length > 200) {
        throw new ApiError(400, "Prompt must be 3–200 characters");
    }

    if (numQuestions < 1 || numQuestions > 20) {
        throw new ApiError(400, "Questions must be 1–20");
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
        throw new ApiError(400, "Invalid difficulty");
    }

    if (!["scq", "mcq"].includes(type)) {
        throw new ApiError(400, "Invalid type");
    }

    const systemPrompt = `
You MUST respond ONLY in valid JSON. No explanations. No markdown.

You MUST ALWAYS include:
- "title"
- "description"
- "questions": an array of EXACTLY ${numQuestions} items.

Each question MUST contain:
- "question": string
- "options": array of 4 items, each having:
    - "text": string
    - "isCorrect": boolean

Return ONLY the JSON.
`;

    const response = await client.responses.create({
        model: process.env.OPENAI_MODEL_NAME,
        max_output_tokens: 2000,
        text: {
            format: { type: "json_object" }
        },
        input: `
        ${systemPrompt}
        Generate a quiz with a title, description, and ${numQuestions} ${difficulty} ${type} questions based on: "${prompt}" Keep the quiz under 1000 output tokens.
        `
    });

    const raw = response.output_text;

    let data;
    try {
        data = JSON.parse(raw);
    } catch (err) {
        console.error("RAW AI OUTPUT:", raw);
        throw new ApiError(500, "AI returned invalid JSON.");
    }

    if (!data.questions || !Array.isArray(data.questions)) {
        throw new ApiError(500, "AI returned invalid quiz structure.");
    }

    const quiz = new Quiz({
        title: data.title,
        description: data.description,
        creatorClerkId: userId,
        questions: data.questions.map((q) => ({
            question: q.question,
            type,
            options: q.options.map((opt) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
            })),
        })),
    });

    const savedQuiz = await quiz.save();

    return res
        .status(201)
        .json(new ApiResponse(201, { quizId: savedQuiz._id }, { message: "quiz generated" }));
});
