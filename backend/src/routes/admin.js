import { Router } from 'express';
import { listUsers, toggleUser, deleteUser, listContent, stats, deletePublication } from '../controllers/adminController.js';
import authMiddleware from '../middlewares/auth.js';
import roleMiddleware from '../middlewares/role.js';

const router = Router();

router.get('/users', authMiddleware, roleMiddleware('admin'), listUsers);
router.put('/users/:id/toggle-activation', authMiddleware, roleMiddleware('admin'), toggleUser);
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), deleteUser);
router.get('/statistics', authMiddleware, roleMiddleware('admin'), stats);
router.get('/publications', authMiddleware, roleMiddleware('admin'), listContent);
router.delete('/publications/:id', authMiddleware, roleMiddleware('admin'), deletePublication);

export default router;
