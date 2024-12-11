import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: number, email: string, firstname: string, lastname: string) => {
  return jwt.sign(
    { userId, email, firstname, lastname },
    process.env.USER_JWT_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

export const generateRefreshToken = (userId: number, email: string, firstname: string, lastname: string) => {
  return jwt.sign(
    { userId, email, firstname, lastname },
    process.env.USER_REFRESH_TOKEN_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.USER_JWT_SECRET!);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.USER_REFRESH_TOKEN_SECRET!);
};
