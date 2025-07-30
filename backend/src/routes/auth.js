import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import authMiddleware from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authMiddleware, me);

export default router;
