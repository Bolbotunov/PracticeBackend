import bcrypt from "bcrypt";
import { prisma } from "#src/lib/prisma.js";
import { LoginInput, RegisterInput } from "#src/schemas/auth.schema.js";
import { generateTokens } from "#src/utils/token.js";

export const registerUser = async (data: RegisterInput) => {
  const { email, password, name } = data;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  return newUser;
};

export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const tokens = generateTokens(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    ...tokens,
  };
};

