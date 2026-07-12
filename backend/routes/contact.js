import express from 'express';
import { submitMessage, getMessages, markAsRead, deleteMessage } from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public
router.post('/', submitMessage);

// Admin
router.get('/', protect, authorize('admin'), getMessages);
router.put('/:id/read', protect, authorize('admin'), markAsRead);
router.delete('/:id', protect, authorize('admin'), deleteMessage);

export default router;
