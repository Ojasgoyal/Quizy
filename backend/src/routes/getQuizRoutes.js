import {Router} from 'express';
import { requireAuth } from '@clerk/express';
import { getQuiz } from "../controllers/getQuizControllers.js"

const router = Router()

router.get("/:quizId" , requireAuth() , getQuiz)

export default router