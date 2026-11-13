import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { RegisterInput } from "../schemas/auth.schema.js";

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
