import express from 'express';
import { getSkillProfile, getWeaknesses } from '../controllers/skillController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getSkillProfile);
router.get('/weaknesses', getWeaknesses);

export default router;