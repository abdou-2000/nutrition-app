import { Router } from 'express';
import auth from '../middlewares/auth.js';
import role from '../middlewares/role.js';
import { createConseil, updateConseil, deleteConseil, getGlobalConseils } from '../controllers/conseilController.js';

const router = Router();

router.get('/', getGlobalConseils);
router.post('/', auth, role('nutritionist'), createConseil);
router.put('/:id', auth, role('nutritionist'), updateConseil);
router.delete('/:id', auth, role('nutritionist'), deleteConseil);

export default router;
