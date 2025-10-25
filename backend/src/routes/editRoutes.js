import { Router } from "express";
import { editQuiz } from "../controllers/editQuizControllers.js";
import { requireAuth } from "@clerk/express";

const router = Router()

router.put("/quiz/:quizId" , requireAuth() , editQuiz)

export default router