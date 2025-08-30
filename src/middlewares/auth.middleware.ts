import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

// Narrowed request type with injected user identity post-auth
export interface AuthedRequest extends Request {
  user?: { user_id: number; email: string };
}

export function authenticate(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  // Expect "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;
  if (!token)
    return res.status(401).json({ message: "Missing Authorization header" });
  try {
    const payload = verifyToken(token);
    req.user = { user_id: payload.user_id, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
