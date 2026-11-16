import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: (process.env.NODE_ENV ?? "development") as "development" | "production" | "test",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  DATABASE_URL: required("DATABASE_URL"),
  ACCESS_TOKEN_SECRET: required("ACCESS_TOKEN_SECRET"),
  REFRESH_TOKEN_SECRET: required("REFRESH_TOKEN_SECRET"),
  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES || "15m",
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS) || 10,
  REFRESH_TOKEN_MAX_AGE_MS: 7 * 24 * 60 * 60 * 1000,
} as const;
