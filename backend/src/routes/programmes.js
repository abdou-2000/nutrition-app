import { Router } from 'express';
import auth from '../middlewares/auth.js';
import role from '../middlewares/role.js';
import { createProgramme, getProgrammes, getProgramme, updateProgramme, deleteProgramme, followProgramme } from '../controllers/programmeController.js';

const router = Router();

router.get('/', getProgrammes);
router.get('/:id', getProgramme);
router.post('/', auth, role('nutritionist'), createProgramme);
router.put('/:id', auth, role('nutritionist'), updateProgramme);
router.delete('/:id', auth, role('nutritionist'), deleteProgramme);
router.post('/:id/suivre', auth, role('client'), followProgramme);

export default router;
