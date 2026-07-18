import express from 'express';
import { getApprovedReviews, getAllReviews, createReview, approveReview, deleteReview, updateReview } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getApprovedReviews);

// Auth required
router.post('/', protect, createReview);

// Admin
router.get('/all', protect, authorize('admin'), getAllReviews);
router.put('/:id/approve', protect, authorize('admin'), approveReview);
router.put('/:id', protect, authorize('admin'), updateReview);
router.delete('/:id', protect, authorize('admin'), deleteReview);

export default router;
