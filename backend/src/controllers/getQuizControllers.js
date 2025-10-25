import { Quiz } from "../models/quiz.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { getAuth } from "@clerk/express"


export const getQuiz = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req)

    if (!userId) throw new ApiError(401, "Unauthorized");

    const { quizId } = req.params;

    const quizData = await Quiz.findById(quizId);
    if (!quizData) throw new ApiError(404, "Quiz not found");
    
    if (quizData?.creatorClerkId !== userId) {
        throw new ApiError(403, "Forbidden: You cannot edit this quiz");
    } 

    res.status(200).json(new ApiResponse(200 , quizData))
})