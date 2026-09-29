import express from 'express';
import { getUserFavorites, toggleFavorite } from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUserFavorites);
router.post('/toggle', protect, toggleFavorite);

export default router;
