// User routes
import { Router } from "express";
import { getMe, listUsers } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Current user and listing
router.get("/me", authenticate, getMe);
router.get("/", listUsers);

export default router;
