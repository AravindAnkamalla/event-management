import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY!,
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY!,
};
