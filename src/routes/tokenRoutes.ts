import { Router } from 'express';
import { refreshAccessToken } from '../controllers/tokenController';

const router = Router();

router.post('/refresh-token', refreshAccessToken);

export default router;
