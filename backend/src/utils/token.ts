import jwt from "jsonwebtoken";
import { env } from "#src/lib/env.js";

const signToken = (userId: string, secret: string, expiresIn: string) => {
  return jwt.sign({ sub: userId }, secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
};

export const generateTokens = (userId: string) => {
  return {
    accessToken: signToken(userId, env.ACCESS_TOKEN_SECRET, env.ACCESS_TOKEN_EXPIRES),
    refreshToken: signToken(userId, env.REFRESH_TOKEN_SECRET, env.REFRESH_TOKEN_EXPIRES),
  };
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET) as { sub: string };
    return decoded.sub;
  } catch {
    return null;
  }
};
