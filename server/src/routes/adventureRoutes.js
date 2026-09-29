import express from 'express';
import { getAllAdventures, getAdventureById, createAdventure, updateAdventure, deleteAdventure } from '../controllers/adventureController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllAdventures);
router.get('/:id', getAdventureById);
router.post('/', protect, authorize('ADMIN'), createAdventure);
router.put('/:id', protect, authorize('ADMIN'), updateAdventure);
router.delete('/:id', protect, authorize('ADMIN'), deleteAdventure);

export default router;
