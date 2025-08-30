// Loads and exposes environment configuration with defaults
import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "change_me",
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN as string | undefined) || "1d",
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS
    ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
    : 10,
};

if (!config.databaseUrl) {
  // eslint-disable-next-line no-console
  console.warn("DATABASE_URL is not set. Please configure it in .env");
}
