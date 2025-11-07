import { Router } from "express";
import { playQuiz, submitQuiz } from "../controllers/playQuizControllers.js";

const router = Router()

router.get("/:quizId" , playQuiz)
router.post("/:quizId/submit" , submitQuiz)

export default router