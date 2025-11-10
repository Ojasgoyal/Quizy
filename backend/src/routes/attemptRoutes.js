import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { getAttemptDetails, getUserAttempts } from "../controllers/attemptControllers.js";

const router = Router()

router.get("/" , requireAuth() , getUserAttempts);
router.get("/:attemptId" , getAttemptDetails) 

export default router;