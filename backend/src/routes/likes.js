import { Router } from 'express';
import auth from '../middlewares/auth.js';
import role from '../middlewares/role.js';
import { like, getLikesForNutritionist } from '../controllers/likeController.js';

const router = Router();

router.post('/', auth, role('client'), like);
router.get('/nutritionist', auth, role('nutritionist'), getLikesForNutritionist);

export default router;
