import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Pet from '../models/Pet.js';
import AdoptionApplication from '../models/AdoptionApplication.js';
import Review from '../models/Review.js';
import ContactMessage from '../models/ContactMessage.js';
import ActivityLog from '../models/ActivityLog.js';
import Service from '../models/Service.js';
import { successResponse } from '../utils/apiResponse.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Admin
export const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalBookings,
      totalPets,
      totalAdoptions,
      totalReviews,
      pendingReviews,
      unreadMessages,
      totalServices
    ] = await Promise.all([
      User.countDocuments({ isDeleted: false, role: 'customer' }),
      Booking.countDocuments({ isDeleted: false }),
      Pet.countDocuments({ isDeleted: false }),
      AdoptionApplication.countDocuments({ isDeleted: false }),
      Review.countDocuments({ isDeleted: false }),
      Review.countDocuments({ isDeleted: false, isApproved: false }),
      ContactMessage.countDocuments({ isDeleted: false, isRead: false }),
      Service.countDocuments({ isDeleted: false, isActive: true })
    ]);

    // Revenue estimation from completed bookings
    const completedBookings = await Booking.find({ status: 'Completed', isDeleted: false })
      .populate('service', 'price');

    const totalRevenue = completedBookings.reduce((acc, b) => {
      return acc + (b.service?.price || 0);
    }, 0);

    // Booking status counts
    const [pendingBookings, confirmedBookings, completedBookingsCount, cancelledBookings, pendingAdoptions] = await Promise.all([
      Booking.countDocuments({ status: 'Pending', isDeleted: false }),
      Booking.countDocuments({ status: 'Confirmed', isDeleted: false }),
      Booking.countDocuments({ status: 'Completed', isDeleted: false }),
      Booking.countDocuments({ status: 'Cancelled', isDeleted: false }),
      AdoptionApplication.countDocuments({ status: 'Under Review', isDeleted: false })
    ]);

    successResponse(res, {
      totalUsers,
      totalBookings,
      totalPets,
      totalAdoptions,
      totalReviews,
      pendingReviews,
      unreadMessages,
      totalServices,
      totalRevenue,
      pendingBookings,
      confirmedBookings,
      completedBookingsCount,
      cancelledBookings,
      pendingAdoptions
    }, 'Dashboard stats fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking chart data (monthly)
// @route   GET /api/dashboard/chart
// @access  Admin
export const getChartData = async (req, res, next) => {
  try {
    const months = 12;
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const bookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isDeleted: false
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Fill in missing months with 0
    const chartData = [];
    for (let i = 0; i < months; i++) {
      const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      const month = d.getMonth() + 1;

      const found = bookings.find(b => b._id.year === year && b._id.month === month);
      chartData.push({
        label: `${monthName} ${year}`,
        value: found ? found.count : 0
      });
    }

    successResponse(res, chartData, 'Chart data fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent users
// @route   GET /api/dashboard/recent-users
// @access  Admin
export const getRecentUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5);

    successResponse(res, users, 'Recent users fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent bookings
// @route   GET /api/dashboard/recent-bookings
// @access  Admin
export const getRecentBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ isDeleted: false })
      .populate('user', 'name email')
      .populate('service', 'name price')
      .sort({ createdAt: -1 })
      .limit(5);

    successResponse(res, bookings, 'Recent bookings fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Admin
export const getRecentActivities = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 15;

    const activities = await ActivityLog.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);

    successResponse(res, activities, 'Activities fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent adoption applications
// @route   GET /api/dashboard/recent-adoptions
// @access  Admin
export const getRecentAdoptions = async (req, res, next) => {
  try {
    const adoptions = await AdoptionApplication.find({ isDeleted: false })
      .populate('user', 'name email')
      .populate('pet', 'name breed')
      .sort({ createdAt: -1 })
      .limit(5);

    successResponse(res, adoptions, 'Recent adoptions fetched');
  } catch (error) {
    next(error);
  }
};
