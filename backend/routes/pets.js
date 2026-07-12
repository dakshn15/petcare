import express from 'express';
import { getPets, getPet, createPet, updatePet, deletePet, getAllPetsAdmin } from '../controllers/petController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getPets);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllPetsAdmin);
router.post('/', protect, authorize('admin'), upload.single('image'), createPet);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updatePet);
router.delete('/:id', protect, authorize('admin'), deletePet);

// Public (must be after /admin/all)
router.get('/:id', getPet);

export default router;
