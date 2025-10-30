import { requireAuth } from "@clerk/express";
import { deleteQuiz } from "../controllers/deleteQuizControllers.js";
import { Router } from "express";

const router = Router()

router.delete("/quiz/:quizId" , requireAuth() , deleteQuiz)

export default router
