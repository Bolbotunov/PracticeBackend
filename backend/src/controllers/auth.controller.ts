import { Request, Response } from "express";
import { loginUser, registerUser } from "#src/services/auth.service.js";
import { LoginInput, RegisterInput } from "#src/schemas/auth.schema.js";
import { AuthRequest } from "#src/middleware/auth.js";
import { prisma } from "#src/lib/prisma.js";
import { generateTokens, verifyRefreshToken } from "#src/utils/token.js";

export const register = async (req: Request, res: Response) => {
  try {
    const input: RegisterInput = req.body;
    const user = await registerUser(input);
    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "USER_ALREADY_EXISTS") {
        return res
          .status(409)
          .json({ error: "User with this email already exists" });
      }
    }
    console.error("Register error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const input: LoginInput = req.body;
    const { user, accessToken, refreshToken } = await loginUser(input);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user,
      accessToken,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: "Unauthorized: No refresh token" });
  }
  const userId = verifyRefreshToken(refreshToken);

  if (!userId) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid refresh token" });
  }

  const tokens = generateTokens(userId);

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({ accessToken: tokens.accessToken });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};
