import { Request, Response } from 'express';
import { refreshSession } from '../services/sessionsService';
import { MESSAGES } from '../messages';

export const refreshAccessToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const refreshToken = authHeader && authHeader.split(' ')[1];

  if (!refreshToken) {
    return res.status(401).json({ message: MESSAGES.AUTH.REFRESH_TOKEN_MISSING });
  }

  try {
    const newAccessToken = await refreshSession(refreshToken, req);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: MESSAGES.AUTH.INVALID_REFRESH_TOKEN });
  }
};
