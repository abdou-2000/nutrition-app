import { Router } from 'express';
import auth from '../middlewares/auth.js';
import role from '../middlewares/role.js';
import { createPlat, updatePlat, deletePlat, getGlobalPlats } from '../controllers/platController.js';

const router = Router();

router.get('/', getGlobalPlats);
router.post('/', auth, role('nutritionist'), createPlat);
router.put('/:id', auth, role('nutritionist'), updatePlat);
router.delete('/:id', auth, role('nutritionist'), deletePlat);

export default router;
