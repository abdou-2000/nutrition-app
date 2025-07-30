import { Router } from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { commentSchema } from '../validators/commentValidator.js';
import { createComment, getMyComments, getCommentsForTarget } from '../controllers/commentController.js';

const router = Router();

router.post('/', auth, validate(commentSchema), createComment);
router.get('/mine', auth, getMyComments);
router.get('/:type/:id', getCommentsForTarget);

export default router;
