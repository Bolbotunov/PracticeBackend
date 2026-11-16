import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets are not defined in .env");
}

const signToken = (userId: string, secret: string, expiresIn: string) => {
  return jwt.sign({ sub: userId }, secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
};

export const generateTokens = (userId: string) => {
  const accessToken = signToken(
    userId,
    ACCESS_SECRET,
    process.env.ACCESS_TOKEN_EXPIRES || "15m",
  );

  const refreshToken = signToken(
    userId,
    REFRESH_SECRET,
    process.env.REFRESH_TOKEN_EXPIRES || "7d",
  );

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as { sub: string };
    return decoded.sub;
  } catch (error) {
    return null;
  }
};
