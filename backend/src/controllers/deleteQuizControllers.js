import { getAuth } from "@clerk/express"
import { Quiz } from "../models/quiz.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const deleteQuiz = asyncHandler(async (req , res) => {
    const {userId} = getAuth(req)

    const {quizId} = req.params

    const quizData = await Quiz.findById(quizId)
    if(!quizData) throw new ApiError(404 , "Quiz Not found")

    if(quizData.creatorClerkId !== userId) {
        throw new ApiError(403 , "Forbidden: You can't delete this quiz")
    }

    const deletedQuiz = await Quiz.deleteOne({_id: quizId})

    return res.status(200).json(new ApiResponse(200 , deletedQuiz.title , "Quiz Deleted Successfully"))
})