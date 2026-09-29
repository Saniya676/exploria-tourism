import express from 'express';
import { getAllDestinations, getDestinationById, createDestination, updateDestination, deleteDestination } from '../controllers/destinationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllDestinations);
router.get('/:id', getDestinationById);
router.post('/', protect, authorize('ADMIN'), createDestination);
router.put('/:id', protect, authorize('ADMIN'), updateDestination);
router.delete('/:id', protect, authorize('ADMIN'), deleteDestination);

export default router;
