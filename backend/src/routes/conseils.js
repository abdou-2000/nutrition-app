import { Router } from 'express';
import auth from '../middlewares/auth.js';
import role from '../middlewares/role.js';
import validate from '../middlewares/validate.js';
import { conseilSchema, conseilUpdateSchema } from '../validators/conseilValidator.js';
import { createConseil, updateConseil, deleteConseil, getGlobalConseils } from '../controllers/conseilController.js';

const router = Router();

router.get('/', getGlobalConseils);
router.post('/', auth, role('nutritionist'), validate(conseilSchema), createConseil);
router.put('/:id', auth, role('nutritionist'), validate(conseilUpdateSchema), updateConseil);
router.delete('/:id', auth, role('nutritionist'), deleteConseil);

export default router;
