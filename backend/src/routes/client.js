import { Router } from 'express';
import auth from '../middlewares/auth.js';
import role from '../middlewares/role.js';
import validate from '../middlewares/validate.js';
import { passwordChangeSchema } from '../validators/authValidator.js';
import { updateProfile, changePassword } from '../controllers/userController.js';

const router = Router();

router.put('/profile', auth, role('client'), updateProfile);
router.put('/password', auth, role('client'), validate(passwordChangeSchema), changePassword);

export default router;
