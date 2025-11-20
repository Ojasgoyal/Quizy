import { Router } from "express"
import { generateQuiz } from "../controllers/generateController.js"
import { requireAuth } from "@clerk/express"

const router = Router();

router.post("/generate" , requireAuth() , generateQuiz)

export default router;