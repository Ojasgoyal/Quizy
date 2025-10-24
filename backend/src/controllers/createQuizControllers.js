import { getAuth } from "@clerk/express"
import { Quiz } from "../models/quiz.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"

export const createQuiz = asyncHandler(async (req, res) => {
    
    const { userId } = getAuth(req)
    if (!userId) {
        throw new ApiError(401, "Unauthorized: user not logged in")
    }
    
    const newQuiz = new Quiz({
        title: "Untitled Quiz",
        description: "",
        creatorClerkId: userId,
        questions: [
            {
                question: "",
                type: "scq",
                options: [
                    { text: "", isCorrect: false },
                ]
            },
        ],
    })
    
    const savedQuiz = await newQuiz.save();

    return res.status(201).json(new ApiResponse(201 , savedQuiz , {message:"quiz created successfully"}))

})
