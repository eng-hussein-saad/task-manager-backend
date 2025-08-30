// Password hashing utilities (bcrypt)
import bcrypt from "bcryptjs";
import { config } from "../config/env";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(config.bcryptSaltRounds);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}
