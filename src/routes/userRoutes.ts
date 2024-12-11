import { Router } from 'express';
import { getUserInfo } from '../controllers/userController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/user', authenticateJWT, getUserInfo);

export default router;
