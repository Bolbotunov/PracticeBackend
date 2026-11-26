import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { z } from "zod";

export const baseAuthSchema = {
  email: z.string().min(1, "Email обязателен").pipe(z.email("Некорректный email")),
  password: z
    .string()
    .min(1, "Пароль обязателен")
    .min(PASSWORD_MIN_LENGTH, "Пароль должен содержать минимум 8 символов"),
};

export const loginSchema = z.object({ ...baseAuthSchema });
export const registerSchema = z.object({ ...baseAuthSchema, name: z.string().optional() });

export const loginResponseSchema = z.object({
  message: z.string(),
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable().optional(),
  }),
});
