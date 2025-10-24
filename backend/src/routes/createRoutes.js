import {Router} from 'express';
import {createQuiz} from "../controllers/createQuizControllers.js"
import { requireAuth } from '@clerk/express';

const router = Router()

router.post("/" , requireAuth() , createQuiz)

export default router