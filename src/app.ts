import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";
import { notFound, errorHandler } from "./middlewares/error.middleware";

dotenv.config();

// Create the Express application instance
const app = express();

// Global middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Parse JSON bodies
app.use(morgan("dev")); // Request logging

// Simple health check endpoint for uptime monitoring
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Feature routes (mounted under /api/*)
app.use("/api/auth", authRoutes); // Registration & login
app.use("/api/tasks", taskRoutes); // Task CRUD & actions
app.use("/api/users", userRoutes); // User endpoints

// Fallbacks and centralized error handling
app.use(notFound);
app.use(errorHandler);

export default app;
