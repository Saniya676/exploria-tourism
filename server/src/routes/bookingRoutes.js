import express from 'express';
import { createBooking, getUserBookings, getGuideBookings, getAllBookings, updateBookingStatus, cancelBooking } from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getUserBookings);
router.get('/guide', protect, authorize('GUIDE'), getGuideBookings);
router.get('/admin', protect, authorize('ADMIN'), getAllBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
