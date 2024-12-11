import { Router } from 'express';
import { register, login, logout } from '../controllers/authController';
import { requestPasswordReset, resetPassword } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
