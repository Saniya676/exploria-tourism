import express from 'express';
import { createInquiry, getAllInquiries, getUserInquiries, getInquiryById, updateInquiryStatus, deleteInquiry } from '../controllers/inquiryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createInquiry);
router.get('/my', protect, getUserInquiries);
router.get('/', protect, authorize('ADMIN'), getAllInquiries);
router.get('/:id', getInquiryById);
router.put('/:id', protect, authorize('ADMIN'), updateInquiryStatus);
router.delete('/:id', protect, authorize('ADMIN'), deleteInquiry);

export default router;
