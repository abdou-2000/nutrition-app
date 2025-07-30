import { Router } from 'express';
import auth from '../middlewares/auth.js';
import role from '../middlewares/role.js';
import validate from '../middlewares/validate.js';
import { likeSchema } from '../validators/likeValidator.js';
import { like, getLikesForNutritionist } from '../controllers/likeController.js';

const router = Router();

router.post('/', auth, role('client'), validate(likeSchema), like);
router.get('/nutritionist', auth, role('nutritionist'), getLikesForNutritionist);

export default router;
