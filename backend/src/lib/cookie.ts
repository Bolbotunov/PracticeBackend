import type { Response } from "express";
import { env } from "#src/lib/env.js";

export const REFRESH_COOKIE_NAME = "refreshToken";

const baseOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const setRefreshCookie = (res: Response, token: string) => {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    ...baseOptions,
    maxAge: env.REFRESH_TOKEN_MAX_AGE_MS,
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie(REFRESH_COOKIE_NAME, baseOptions);
};
