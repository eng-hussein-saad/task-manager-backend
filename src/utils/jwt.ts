// JWT utilities: sign and verify access tokens
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { config } from "../config/env";
import { JwtPayloadData } from "../types";

export function signToken(payload: JwtPayloadData): string {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as unknown as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, config.jwtSecret as Secret, options);
}

export function verifyToken(token: string): JwtPayloadData {
  return jwt.verify(token, config.jwtSecret as Secret) as JwtPayloadData;
}
