import { Router } from 'express';
import { listUsers } from '../controllers/adminController.js';
import authMiddleware from '../middlewares/auth.js';
import roleMiddleware from '../middlewares/role.js';

const router = Router();

router.get('/users', authMiddleware, roleMiddleware('admin'), listUsers);

export default router;
