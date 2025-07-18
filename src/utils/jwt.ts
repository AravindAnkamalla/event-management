import jwt from "jsonwebtoken";

export function generateAccessToken(payload: Record<string, unknown>) {
  const secret = process.env.JWT_SECRET;

  const expiry = process.env.ACCESS_TOKEN_EXPIRY;

  if (!secret || !expiry) {
    throw new Error("JWT_SECRET or ACCESS_TOKEN_EXPIRY is not defined");
  }
  const expiresIn = parseInt(expiry, 10) || "1h";
  return jwt.sign(payload, secret, { expiresIn });
}

export function generateRefreshToken(payload: Record<string, unknown>) {
  const secret = process.env.JWT_REFRESH_SECRET;

  const expiry = process.env.REFRESH_TOKEN_EXPIRY;

  if (!secret || !expiry) {
    throw new Error(
      "JWT_REFRESH_SECRET or REFRESH_TOKEN_EXPIRY is not defined"
    );
  }
  const expiresIn = parseInt(expiry, 10) || "7d";
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string, secret: string) {
  return jwt.verify(token, secret);
}
