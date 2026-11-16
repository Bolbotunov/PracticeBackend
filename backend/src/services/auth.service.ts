import bcrypt from "bcrypt";
import { prisma } from "#src/lib/prisma.js";
import { env } from "#src/lib/env.js";
import { ConflictError, UnauthorizedError } from "#src/lib/errors.js";
import { LoginInput, RegisterInput } from "#src/schemas/auth.schema.js";
import { generateTokens } from "#src/utils/token.js";

export const registerUser = async (data: RegisterInput) => {
  const { email, password, name } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError("User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, env.SALT_ROUNDS);

  return prisma.user.create({
    data: { email, passwordHash, name },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
};

export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const tokens = generateTokens(user.id);
  const { passwordHash: _, ...safeUser } = user;

  return { user: safeUser, ...tokens };
};
