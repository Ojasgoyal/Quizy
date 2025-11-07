import dotenv from "dotenv"
dotenv.config({
  path:"./.env"
});
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { clerkClient, clerkMiddleware, getAuth, requireAuth } from '@clerk/express'

const app = express();


const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}
app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))

app.use(cookieParser())
app.use(clerkMiddleware())


import healthcheckRouter from "./routes/healthcheckRoutes.js"
import createQuiz from "./routes/createRoutes.js"
import getQuiz from "./routes/getQuizRoutes.js";
import getUserQuiz from "./routes/getUserQuizRoutes.js";
import editQuiz from "./routes/editRoutes.js";
import deleteQuiz  from "./routes/deleteRoutes.js";
import playQuiz  from "./routes/playQuizRoutes.js";

app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/create", createQuiz)
app.use("/api/v1/edit" , editQuiz)
app.use("/api/v1/delete" , deleteQuiz)
app.use("/api/v1/quiz", getQuiz)
app.use("/api/v1/userquizzes", getUserQuiz)
app.use("/api/v1/play" , playQuiz)

app.get("/", (req, res) => {
    res.send("Quizy API running...");
});

app.use((err, req, res, next) => {
    res.status(err.statuscode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

export default app