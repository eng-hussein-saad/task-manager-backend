// Auth routes: registration and login
import { Router } from "express";
import {
  login,
  loginValidators,
  register,
  registerValidators,
  refreshToken,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Register and login endpoints
router.post("/register", registerValidators, register);
router.post("/login", loginValidators, login);
router.post("/refresh", authenticate, refreshToken);

export default router;
