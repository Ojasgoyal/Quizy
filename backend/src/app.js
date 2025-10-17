import express  from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { clerkMiddleware } from '@clerk/express'

const app = express();

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(cookieParser())
app.use(clerkMiddleware())

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

import healthcheckRouter from "./routes/healthcheckRoutes.js"

app.use("/api/v1/healthcheck" , healthcheckRouter)

app.get("/", (req, res) => {
    res.send("Quizy API running...");
});

export default app