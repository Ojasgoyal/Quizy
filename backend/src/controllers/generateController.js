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
import { quizSchema } from "../validators/quizValidator.js"


export const generateQuiz = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req)

    if (!userId) {
        throw new ApiError(401, "Unauthorized: user not logged in")
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
    console.log(type)
    const questype = type === "scq" ? "Single-Correct" : "Multi-Correct"
    console.log(questype)

    const systemPrompt = `
You MUST respond ONLY in valid JSON. No explanations. No markdown.

You MUST ALWAYS include:
- "title"
- "description"
- "questions": an array of EXACTLY ${numQuestions} items.

Each question MUST contain:
- "question": string (max 2 lines)
- "type": "scq" (for single correct) or "mcq" (for multi correct)
- "options": array of 4 items (each max 5 words), each having:
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
        Generate a quiz with a title, description, It should have ${numQuestions} questions of ${difficulty} difficulty and type ${questype} on the topic: "${prompt}" Keep the quiz under 1000 output tokens. Make sure that the questions or options are not too long. *For Multiple-correct make all correct options isCorrect:true.
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

    const { error, value } = quizSchema.validate(data || {}, { abortEarly: false });
    if (error) {
        throw new ApiError(400, error.details.map(d => d.message).join(", "));
    }

    const quiz = new Quiz({
        title: value.title,
        description: value.description,
        creatorClerkId: userId,
        questions: value.questions
    });

    const savedQuiz = await quiz.save();

    return res
        .status(201)
        .json(new ApiResponse(201, { quizId: savedQuiz._id }, { message: "quiz generated" }));
});
