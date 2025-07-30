import { Router } from 'express';
import auth from '../middlewares/auth.js';
import role from '../middlewares/role.js';
import { advanceSuivi } from '../controllers/programmeController.js';

const router = Router();

router.put('/:id/avancer', auth, role('client'), advanceSuivi);

export default router;
