import express from 'express';
import { getAllPackages, getPackageById, createPackage, updatePackage, deletePackage } from '../controllers/packageController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllPackages);
router.get('/:id', getPackageById);
router.post('/', protect, authorize('ADMIN'), createPackage);
router.put('/:id', protect, authorize('ADMIN'), updatePackage);
router.delete('/:id', protect, authorize('ADMIN'), deletePackage);

export default router;
