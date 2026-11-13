import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password is too long"),
  name: z.string().min(1).max(50).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
