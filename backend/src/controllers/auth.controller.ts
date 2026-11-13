import { Request, Response } from "express";
import { registerUser } from "../services/auth.service.js";
import { RegisterInput } from "../schemas/auth.schema.js";

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
