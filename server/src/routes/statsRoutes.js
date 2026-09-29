import express from 'express';
import { getAdminStats } from '../controllers/statsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin', protect, authorize('ADMIN'), getAdminStats);

export default router;
