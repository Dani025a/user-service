import { prisma } from '../models';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { MESSAGES } from '../messages';


interface SessionData {
  deviceInfo: string;
  ipAddress: string;
}

export const createSession = async (
  userId: number,
  email: string,
  firstname: string,
  lastname: string,
  sessionData: SessionData
) => {
  try {
    const accessToken = generateAccessToken(userId, email, firstname, lastname);
    const refreshToken = generateRefreshToken(userId, email, firstname, lastname);

    console.log('Session Data:', sessionData);

    await prisma.userSession.create({
      data: {
        accessToken,
        refreshToken,
        refreshTokenExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        accessTokenExpiration: new Date(Date.now() + 1 * 60 * 60 * 1000),
        userId,
        deviceInfo: sessionData.deviceInfo.substring(0, 255),
        ipAddress: sessionData.ipAddress,
        isActive: true,
      },
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error during session creation:', error.message);
    throw new Error(MESSAGES.SESSION.FAILED_SESSION_CREATION);
  }
};


export const refreshSession = async (refreshToken: string, req: any) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);

    const session = await prisma.userSession.findFirst({
      where: { refreshToken },
    });

    if (!session) {
      throw new Error(MESSAGES.SESSION.INVALID_OR_INACTIVE);
    }

    const newAccessToken = generateAccessToken(decoded.userId, decoded.email, decoded.firstname, decoded.lastname);
    const newAccessTokenExpiration = new Date(Date.now() + 1 * 60 * 60 * 1000);

    const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = req.ip;
    

    await prisma.userSession.update({
      where: { id: session.id },
      data: {
        accessToken: newAccessToken,
        accessTokenExpiration: newAccessTokenExpiration,
        deviceInfo,
        ipAddress,
      },
    });

    console.log(newAccessToken)
    return newAccessToken;
  } catch (err) {
    throw new Error(MESSAGES.SESSION.EXPIRED_REFRESH_TOKEN);
  }
};



export const deactivateSession = async (refreshToken: string) => {
  try {
    await prisma.userSession.updateMany({
      where: { refreshToken },
      data: {
        isActive: false,
      },
    });
  } catch (error) {
    throw new Error(MESSAGES.SESSION.FAILED_DEACTIVATE);
  }
};

export const deactivateExpiredSessions = async () => {
  try {
    const now = new Date();

    await prisma.userSession.updateMany({
      where: {
        refreshTokenExpiration: { lte: now },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    console.log(MESSAGES.SESSION.SESSION_DEACTIVATED);
  } catch (error) {
    console.error(MESSAGES.SESSION.FAILED_DEACTIVATE);
  }
};