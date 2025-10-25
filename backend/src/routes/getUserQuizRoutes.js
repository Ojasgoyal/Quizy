import { Router } from 'express';
import { requireAuth } from '@clerk/express';
import { getUserQuiz } from '../controllers/userQuizControllers.js';

const router = Router()

router.get("/", requireAuth(), getUserQuiz)

export default router