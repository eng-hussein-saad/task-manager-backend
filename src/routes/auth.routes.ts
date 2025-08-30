// Auth routes: registration and login
import { Router } from "express";
import {
  login,
  loginValidators,
  register,
  registerValidators,
} from "../controllers/auth.controller";

const router = Router();

// Register and login endpoints
router.post("/register", registerValidators, register);
router.post("/login", loginValidators, login);

export default router;
