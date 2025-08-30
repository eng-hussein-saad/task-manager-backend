import { NextFunction, Request, Response } from "express";

export function notFound(_req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({ message: "Route not found" });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
}
