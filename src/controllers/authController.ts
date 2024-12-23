import { Request, Response } from 'express';
import { createUser, findUserByEmail } from '../services/userService';
import { createSession, deactivateSession } from '../services/sessionsService';
import bcrypt from 'bcrypt';
import { requestPasswordResetService, resetPasswordService } from '../services/passwordService';
import { MESSAGES } from '../messages';

export const register = async (req: Request, res: Response) => {
  const { email, username, password, firstname, lastname, phone, street, zipcode, city } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({
      email,
      username,
      password: hashedPassword,
      firstname,
      lastname,
      phone,
      street,
      zipcode,
      city,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta && error.meta.target) {
      if (error.meta.target.includes('User_email_key')) {
        return res.status(400).json({ message: MESSAGES.USER.EMAIL_ALREADY_EXISTS });
      } else if (error.meta.target.includes('User_username_key')) {
        return res.status(400).json({ message: MESSAGES.USER.USERNAME_ALREADY_EXISTS });
      }
    }

    res.status(400).json({ message: MESSAGES.USER.REGISTRATION_FAILED, error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt with email:', email);

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: MESSAGES.USER.INVALID_CREDENTIALS });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: MESSAGES.USER.INVALID_CREDENTIALS });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ message: MESSAGES.USER.ACCOUNT_INACTIVE });
    }

    const deviceInfo = req.headers['x-device-info'] || 'Unknown Device';
    const ipAddress = req.headers['x-ip-address'] || '127.0.0.1';

    console.log('Device Info:', deviceInfo);
    console.log('IP Address:', ipAddress);

    const { accessToken, refreshToken } = await createSession(
      user.id,
      user.email,
      user.firstname,
      user.lastname,
      { deviceInfo, ipAddress }
    );

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: MESSAGES.AUTH.LOGIN_FAILED });
  }
};



export const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const refreshToken = authHeader && authHeader.split(' ')[1];

  if (!refreshToken) {
    return res.status(401).json({ message: MESSAGES.AUTH.REFRESH_TOKEN_MISSING });
  }

  try {
    await deactivateSession(refreshToken);
    res.status(200).json({ message: MESSAGES.SESSION.LOGOUT_SUCCESS });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: MESSAGES.AUTH.FAILED_LOGOUT });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    await requestPasswordResetService(email);
    res.status(200).json({ message: MESSAGES.PASSWORD.EMAIL_SENT });
  } catch (error) {
    console.error('Error during password reset request:', error);
    res.status(500).json({ message: MESSAGES.PASSWORD.RESET_REQUEST_ERROR, error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    await resetPasswordService(token, newPassword);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: MESSAGES.PASSWORD.RESET_ERROR, error });
  }
};
