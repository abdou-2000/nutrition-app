import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { getNotifications } from '../controllers/notificationController.js';

const router = Router();

router.get('/', auth, getNotifications);

export default router;
