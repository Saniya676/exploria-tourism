import express from 'express';
import { getAllGuides, getGuideById, matchGuidesController, updateGuideProfile, getGuideRequests, respondGuideRequest } from '../controllers/guideController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllGuides);
router.get('/requests', protect, authorize('GUIDE'), getGuideRequests);
router.put('/requests/:requestId', protect, authorize('GUIDE'), respondGuideRequest);
router.post('/match', matchGuidesController);
router.get('/:id', getGuideById);
router.put('/profile', protect, authorize('GUIDE', 'ADMIN'), updateGuideProfile);

export default router;
