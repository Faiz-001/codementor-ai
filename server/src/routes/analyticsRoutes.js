// server/src/routes/analyticsRoutes.js
import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only authenticated users with role === 'admin' can fetch platform analytics
router.get('/', protect, admin, getAnalytics);

export default router;