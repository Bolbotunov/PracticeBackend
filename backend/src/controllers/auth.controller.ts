import { Request, Response } from "express";
import { loginUser, registerUser } from "#src/services/auth.service.js";
import { AuthRequest } from "#src/middleware/auth.js";
import { prisma } from "#src/lib/prisma.js";
import { NotFoundError, UnauthorizedError } from "#src/lib/errors.js";
import { clearRefreshCookie, REFRESH_COOKIE_NAME, setRefreshCookie } from "#src/lib/cookie.js";
import { generateTokens, verifyRefreshToken } from "#src/utils/token.js";

export const register = async (req: Request, res: Response) => {
  const user = await registerUser(req.body);
  return res.status(201).json({
    message: "User registered successfully",
    user,
  });
};

export const login = async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await loginUser(req.body);
  setRefreshCookie(res, refreshToken);

  return res.status(200).json({
    message: "Login successful",
    user,
    accessToken,
  });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return res.json({ user });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies[REFRESH_COOKIE_NAME];
  if (!token) {
    throw new UnauthorizedError("No refresh token");
  }

  const userId = verifyRefreshToken(token);
  if (!userId) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  const tokens = generateTokens(userId);
  setRefreshCookie(res, tokens.refreshToken);

  return res.json({ accessToken: tokens.accessToken });
};

export const logout = (_req: Request, res: Response) => {
  clearRefreshCookie(res);
  return res.status(200).json({ message: "Logged out successfully" });
};
