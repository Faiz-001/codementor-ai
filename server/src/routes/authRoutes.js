import express from 'express';
import { register, login, submitOnboarding, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/onboarding', protect, submitOnboarding);
router.get('/me', protect, getMe);

export default router;