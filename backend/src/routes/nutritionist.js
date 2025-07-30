import { Router } from 'express';
import auth from '../middlewares/auth.js';
import role from '../middlewares/role.js';
import { getCommentsReceived } from '../controllers/commentController.js';

const router = Router();

router.get('/comments-recus', auth, role('nutritionist'), getCommentsReceived);

export default router;
