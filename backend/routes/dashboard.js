import express from 'express';
import { getStats, getChartData, getRecentUsers, getRecentBookings, getRecentActivities, getRecentAdoptions } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin only
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/chart', getChartData);
router.get('/recent-users', getRecentUsers);
router.get('/recent-bookings', getRecentBookings);
router.get('/recent-adoptions', getRecentAdoptions);
router.get('/activities', getRecentActivities);

export default router;
