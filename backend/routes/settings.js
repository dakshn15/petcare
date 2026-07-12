import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getSettings);

// Admin
router.put('/', protect, authorize('admin'), updateSettings);

export default router;
