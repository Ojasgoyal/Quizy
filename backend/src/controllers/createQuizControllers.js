import { getAuth } from "@clerk/express"
import { Quiz } from "../models/quiz.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { quizSchema } from "../validators/quizValidator.js"

export const createQuiz = asyncHandler(async (req, res) => {

    const { userId } = getAuth(req)
    if (!userId) {
        throw new ApiError(401, "Unauthorized: user not logged in")
    }

    const { error, value } = quizSchema.validate(req.body || {}, { abortEarly: false });
    if (error) {
        throw new ApiError(400, error.details.map(d => d.message).join(", "));
    }

    const newQuiz = new Quiz({
        title: value.title,
        description: value.description,
        creatorClerkId: userId,
        questions: value.questions,
    });

    const savedQuiz = await newQuiz.save();

    return res.status(201).json(new ApiResponse(201, savedQuiz, { message: "quiz created successfully" }))

})
