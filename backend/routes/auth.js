import express from 'express';
import { register, login, logout, refreshToken, getProfile, updateProfile, updatePassword, uploadAvatar, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect, getOptionalUser } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes (with auth rate limiter)
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.post('/logout', protect, logout);
router.get('/profile', getOptionalUser, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.put('/avatar', protect, upload.single('avatar'), uploadAvatar);

export default router;
