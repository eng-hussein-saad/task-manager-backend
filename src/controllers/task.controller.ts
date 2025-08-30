import { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { TaskModel } from "../models/task.model";
import { AuthedRequest } from "../middlewares/auth.middleware";
import { prisma } from "../config/db";

// Validation for creating a task
export const createTaskValidators = [
  body("task_title")
    .isString()
    .isLength({ min: 1 })
    .withMessage("task_title is required"),
  body("task_description").optional().isString(),
  body("is_read").optional().isBoolean().toBoolean(),
];

// POST /api/tasks - create task for current user
export async function createTask(req: AuthedRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const { task_title, task_description, is_read } = req.body as {
    task_title: string;
    task_description?: string;
    is_read?: boolean;
  };
  const ownerId = req.user?.user_id ?? null;
  const task = await TaskModel.create({
    task_title,
    task_description: task_description ?? null,
    is_read: is_read ?? false,
    user_id: ownerId,
  });
  res.status(201).json(task);
}

// GET /api/tasks - list tasks for current user
export async function listTasks(req: AuthedRequest, res: Response) {
  const userId = req.user!.user_id;
  const tasks = await TaskModel.findAllByUser(userId);
  res.json(tasks);
}

// Common :id validator
export const idParamValidator = [param("id").isInt().toInt()];

// GET /api/tasks/:id - fetch single task (authorized)
export async function getTask(req: AuthedRequest, res: Response) {
  const id = Number(req.params.id);
  const task = await TaskModel.findById(id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (task.user_id !== req.user!.user_id)
    return res.status(403).json({ message: "Forbidden" });
  res.json(task);
}

// Validation for updating a task
export const updateTaskValidators = [
  param("id").isInt().toInt(),
  body("task_title").optional().isString(),
  body("task_description").optional().isString(),
  body("is_read").optional().isBoolean().toBoolean(),
];

// PUT /api/tasks/:id - update task fields (authorized)
export async function updateTask(req: AuthedRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const id = Number(req.params.id);
  const existing = await TaskModel.findById(id);
  if (!existing) return res.status(404).json({ message: "Task not found" });
  if (existing.user_id !== req.user!.user_id)
    return res.status(403).json({ message: "Forbidden" });
  const { task_title, task_description, is_read } = req.body as {
    task_title?: string;
    task_description?: string;
    is_read?: boolean;
  };
  const updated = await TaskModel.update(id, {
    task_title,
    task_description,
    is_read,
    user_id: existing.user_id,
  });
  res.json(updated);
}

// DELETE /api/tasks/:id - remove task (authorized)
export async function deleteTask(req: AuthedRequest, res: Response) {
  const id = Number(req.params.id);
  const task = await TaskModel.findById(id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (task.user_id !== req.user!.user_id)
    return res.status(403).json({ message: "Forbidden" });
  const ok = await TaskModel.remove(id);
  if (!ok) return res.status(404).json({ message: "Task not found" });
  res.status(204).send();
}

// PATCH /api/tasks/:id/toggle-read - flip is_read (authorized)
export async function toggleTaskRead(req: AuthedRequest, res: Response) {
  const id = Number(req.params.id);
  const task = await TaskModel.findById(id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (task.user_id !== req.user!.user_id)
    return res.status(403).json({ message: "Forbidden" });
  const updated = await prisma.task.update({
    where: { task_id: id },
    data: { is_read: !task.is_read },
  });
  res.json(updated);
}
