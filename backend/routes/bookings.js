import express from 'express';
import { createBooking, getMyBookings, getAllBookings, getBooking, approveBooking, completeBooking, cancelBooking } from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Auth required
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);

// Admin routes
router.get('/', protect, authorize('admin'), getAllBookings);

// Single booking (auth required, ownership checked in controller)
router.get('/:id', protect, getBooking);
router.put('/:id/approve', protect, authorize('admin'), approveBooking);
router.put('/:id/complete', protect, authorize('admin'), completeBooking);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
