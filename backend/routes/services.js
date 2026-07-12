import express from 'express';
import { getServices, getService, createService, updateService, deleteService, getAllServicesAdmin } from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getServices);

// Admin routes (must be before /:value)
router.get('/admin/all', protect, authorize('admin'), getAllServicesAdmin);
router.post('/', protect, authorize('admin'), createService);
router.put('/:id', protect, authorize('admin'), updateService);
router.delete('/:id', protect, authorize('admin'), deleteService);

// Public route (last to avoid catching admin/all)
router.get('/:value', getService);

export default router;
