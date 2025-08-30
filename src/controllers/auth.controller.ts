import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { UserModel } from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/hash";
import { signToken } from "../utils/jwt";
import { AuthedRequest } from "../middlewares/auth.middleware";

// Validation rules for registration
export const registerValidators = [
  body("first_name")
    .isString()
    .isLength({ min: 1 })
    .withMessage("first_name is required"),
  body("last_name")
    .isString()
    .isLength({ min: 1 })
    .withMessage("last_name is required"),
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password")
    .isString()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"
    ),
];

// POST /api/auth/register
export async function register(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const { first_name, last_name, email, password } = req.body as {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  };
  const existing = await UserModel.findByEmail(email);
  if (existing)
    return res.status(409).json({ message: "Email already in use" });
  const hashed = await hashPassword(password);
  const user = await UserModel.create({
    first_name,
    last_name,
    email,
    password: hashed,
  });
  const token = signToken({ user_id: user.user_id, email: user.email });
  res.status(201).json({
    user: { user_id: user.user_id, first_name, last_name, email },
    token,
  });
}

// Validation rules for login
export const loginValidators = [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Password is required"),
];

// POST /api/auth/login
export async function login(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body as { email: string; password: string };
  const user = await UserModel.findByEmail(email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  const token = signToken({ user_id: user.user_id, email: user.email });
  res.json({
    user: {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    },
    token,
  });
}

// POST /api/auth/refresh (requires Bearer token)
export async function refreshToken(req: AuthedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const user = await UserModel.findById(req.user.user_id);
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  const token = signToken({ user_id: user.user_id, email: user.email });
  return res.json({ token });
}
