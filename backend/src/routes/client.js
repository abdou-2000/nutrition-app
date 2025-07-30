import { Router } from 'express';
import auth from '../middlewares/auth.js';
import role from '../middlewares/role.js';
import { updateProfile, changePassword } from '../controllers/userController.js';

const router = Router();

router.put('/profile', auth, role('client'), updateProfile);
router.put('/password', auth, role('client'), changePassword);

export default router;
