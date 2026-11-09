import express from 'express';
import { createAnalysis, getAnalysisById, getAnalyses } from '../controllers/analysisController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all analysis endpoints

router.post('/', createAnalysis);
router.get('/', getAnalyses);
router.get('/:id', getAnalysisById);

export default router;