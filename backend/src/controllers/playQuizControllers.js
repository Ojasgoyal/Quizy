import { Quiz } from "../models/quiz.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Attempt } from "../models/attempt.js"
import { getAuth, clerkClient } from "@clerk/express"

export const playQuiz = asyncHandler(async (req, res) => {
    const { quizId } = req.params

    const quizData = await Quiz.findById(quizId)
        .select("-creatorClerkId -questions.options.isCorrect")
        .lean()

    if (!quizData) throw new ApiError(404, "Quiz not found")

    res.status(200).json(new ApiResponse(200, quizData))
})


export const submitQuiz = asyncHandler(async (req, res) => {
    const { quizId } = req.params
    const { playerName, answers } = req.body
    const { userId } = getAuth(req)
    const quizData = await Quiz.findById(quizId).select("questions").lean()

    if (!quizData) throw new ApiError(404, "Quiz not found")

    let score = 0
    let finalPlayerName = playerName
    if (userId) {
        const user = await clerkClient.users.getUser(userId);
        finalPlayerName = user.firstName + " " + user.lastName;
    }
    const finalPlayerClerkId = userId || null;
    if(!finalPlayerName) throw new ApiError(400 , "Player Name is Required")

    const answersMap = new Map(answers.map((answer) => [answer.questionId, answer.markedAnswerId]));

    const validAnswers = quizData.questions.map((question) => {
        const markedAnswerId = answersMap.get(question._id.toString());

        if (!markedAnswerId) {
            return {
                questionId: question._id,
                answerGiven: null,
                isCorrect: false,
            }
        }

        const correctOption = question.options.find((o) => o.isCorrect)
        const isCorrect = correctOption && correctOption._id.toString() === markedAnswerId

        if (isCorrect) score += 1;

        return {
            questionId: question._id,
            answerGiven: markedAnswerId,
            isCorrect,
        }
    })

    const attempt = new Attempt({
        quizId,
        playerClerkId: finalPlayerClerkId || null,
        playerName: finalPlayerName,
        score,
        answers: validAnswers,
    })
    
    const attemptData = await attempt.save();
    res.status(200).json(new ApiResponse(200, { attemptData, totalQuestions: quizData.questions.length }))

})
