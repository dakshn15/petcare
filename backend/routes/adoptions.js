import express from 'express';
import { submitApplication, getMyAdoptions, getAllApplications, approveApplication, rejectApplication } from '../controllers/adoptionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Auth required
router.post('/', protect, submitApplication);
router.get('/my', protect, getMyAdoptions);

// Admin
router.get('/', protect, authorize('admin'), getAllApplications);
router.put('/:id/approve', protect, authorize('admin'), approveApplication);
router.put('/:id/reject', protect, authorize('admin'), rejectApplication);

export default router;
