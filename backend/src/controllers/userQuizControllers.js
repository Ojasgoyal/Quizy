import { getAuth } from "@clerk/express";
import { Quiz } from "../models/quiz.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const getUserQuiz = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req)

    if (!userId) throw new ApiError(401, "Unauthorized Access")

    const quizzes = await Quiz.find({ creatorClerkId: userId }).select("_id title createdAt updatedAt").sort({ updatedAt: -1 })

    return res.status(200).json(new ApiResponse(200 , quizzes))
})