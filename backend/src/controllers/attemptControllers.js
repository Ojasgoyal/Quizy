import { Attempt } from "../models/attempt.js";
import { Quiz } from "../models/quiz.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAuth } from "@clerk/express";


export const getUserAttempts = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    if (!userId) throw new ApiError(401, "Unauthorized")
    const attempts = await Attempt.find({ playerClerkId: userId })
        .populate("quizId", "title description")
        .sort({ createdAt: -1 })
        .lean()
    res.status(200).json(new ApiResponse(200, attempts))
})


export const getAttemptDetails = asyncHandler(async (req, res) => {
    const { attemptId } = req.params

    const attempt = await Attempt.findById(attemptId).populate({
        path: "quizId",
        select: "title description questions",
        populate: {
            path: "questions.options",
            select: "text isCorrect",
        },
    }).lean()

    if (!attempt) throw new ApiError(404, "Attempt not found");

    res.status(200).json(new ApiResponse(200, attempt));
})