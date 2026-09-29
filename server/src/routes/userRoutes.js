import express from 'express';
import { getAllUsers, updateUserRole, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('ADMIN'), getAllUsers);
router.put('/:id/role', protect, authorize('ADMIN'), updateUserRole);
router.delete('/:id', protect, authorize('ADMIN'), deleteUser);

export default router;
