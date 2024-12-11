import { Request, Response } from 'express';
import { prisma } from '../models';
import { MESSAGES } from '../messages';

export const getUserInfo = async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      phone: true,
      street: true,
      zipcode: true,
      city: true,
      username: true,
    },
  });

  if (!user) return res.status(404).json({ message: MESSAGES.USER.NOT_FOUND });

  res.status(200).json(user);
};