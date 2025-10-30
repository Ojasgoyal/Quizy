import { getAuth } from "@clerk/express"
import { Quiz } from "../models/quiz.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { quizSchema } from "../validators/quizValidator.js";

export const editQuiz = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req)
    if (!userId) throw new ApiError(401, "Unauthorized")

    const { quizId } = req.params;

    const quizData = await Quiz.findById(quizId)
    if (!quizData) throw new ApiError(404, "Not Found")

    if (quizData?.creatorClerkId !== userId) {
        throw new ApiError(403, "Forbidden: You cannot edit this quiz");
    }

    const { error, value } = quizSchema.validate(req.body, { abortEarly: false });
    if (error) {
        throw new ApiError(400, error.details.map(d => d.message).join(", "));
    }

    quizData.title = value.title;
    quizData.description = value.description;
    quizData.questions = value.questions;

    await quizData.save();

    res.status(200).json(new ApiResponse(200, quizData , {message: "Quiz updated successfully"}));
})