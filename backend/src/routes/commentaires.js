import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { createComment, getMyComments, getCommentsForTarget } from '../controllers/commentController.js';

const router = Router();

router.post('/', auth, createComment);
router.get('/mine', auth, getMyComments);
router.get('/:type/:id', getCommentsForTarget);

export default router;
