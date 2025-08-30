import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { AuthedRequest } from "../middlewares/auth.middleware";

// GET /api/users/me - return authenticated user (sans password)
export async function getMe(req: AuthedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const user = await UserModel.findById(req.user.user_id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const { password, ...safe } = user as any;
  res.json(safe);
}

// GET /api/users - list users (safe fields only)
export async function listUsers(_req: Request, res: Response) {
  const users = await UserModel.findAll();
  res.json(users);
}
