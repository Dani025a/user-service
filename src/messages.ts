export const MESSAGES = {
    USER: {
      REGISTRATION_FAILED: 'User registration failed',
      INVALID_CREDENTIALS: 'Invalid credentials',
      ACCOUNT_INACTIVE: 'Account is not active',
      NOT_FOUND: 'User not found',
      EMAIL_ALREADY_EXISTS: 'This email is already registered',
      USERNAME_ALREADY_EXISTS: 'This username is already taken',
    },
    AUTH: {
      TOKEN_MISSING: 'Access token missing',
      INVALID_ACCESS_TOKEN: 'Invalid or expired access token',
      INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
      REFRESH_TOKEN_MISSING: 'Refresh token missing',
      FAILED_LOGOUT: 'Failed to log out',
    },
    PASSWORD: {
      RESET_REQUEST_ERROR: 'Error requesting password reset',
      RESET_ERROR: 'Error resetting password',
      EMAIL_SENT: 'Password reset email sent',
      USER_NOT_FOUND: 'User not found for password reset request',
      INVALID_OR_EXPIRED_TOKEN: 'Invalid or expired token for password reset',
      PASSWORD_RESET_SUCCESFUL: 'Password reset successfully'
    },
    SESSION: {
      INVALID_OR_INACTIVE: 'Session is invalid or inactive',
      FAILED_DEACTIVATE: 'Failed to deactivate session',
      NO_REFRESH_TOKEN: 'Refresh token missing',
      LOGOUT_SUCCESS: 'Logged out successfully',
      SESSION_DEACTIVATED: 'Expired sessions have been deactivated',
      FAILED_SESSION_CREATION: 'Failed to create session',
      FAILED_SESSION_REFRESH: 'Failed to refresh session',
      EXPIRED_REFRESH_TOKEN: 'Invalid or expired refresh token',
    },
    GENERAL: {
      INTERNAL_SERVER_ERROR: 'Internal server error',
      FORBIDDEN: 'Forbidden',
      UNAUTHORIZED: 'Unauthorized access',
    },
  };
  