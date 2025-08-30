// Task routes
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createTask,
  createTaskValidators,
  deleteTask,
  getTask,
  idParamValidator,
  listTasks,
  toggleTaskRead,
  updateTask,
  updateTaskValidators,
} from "../controllers/task.controller";

const router = Router();

// CRUD & toggle endpoints (all require auth)
router.get("/", authenticate, listTasks);
router.post("/", authenticate, createTaskValidators, createTask);
router.get("/:id", authenticate, idParamValidator, getTask);
router.put("/:id", authenticate, updateTaskValidators, updateTask);
router.delete("/:id", authenticate, idParamValidator, deleteTask);
router.patch(
  "/:id/toggle-read",
  authenticate,
  idParamValidator,
  toggleTaskRead
);

export default router;
