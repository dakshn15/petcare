import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { sendBookingConfirmation, sendBookingStatusEmail } from '../services/emailService.js';
import logActivity from '../services/activityService.js';

// @desc    Create booking
// @route   POST /api/bookings
// @access  Auth
export const createBooking = async (req, res, next) => {
  try {
    const { serviceValue, petName, petType, petSize, date, time, notes, addons } = req.body;

    // Find service by value (slug)
    const service = await Service.findOne({ value: serviceValue, isDeleted: false });
    if (!service) {
      return errorResponse(res, 'Service not found', 404);
    }

    let totalPrice = service.price;
    const selectedAddonLabels = [];
    const addonsArray = Array.isArray(addons) ? addons : [];

    if (addonsArray.length > 0) {
      (service.addons || []).forEach(addon => {
        const idStr = addon.addonId || addon._id?.toString() || '';
        if (addonsArray.includes(idStr) || addonsArray.includes(addon.name)) {
          totalPrice += addon.price;
          selectedAddonLabels.push(`${addon.name} (+$${addon.price})`);
        }
      });
    }

    const serviceLabel = selectedAddonLabels.length > 0
      ? `${service.name} (with ${selectedAddonLabels.join(', ')}) - $${totalPrice}`
      : `${service.name} - $${totalPrice}`;

    const booking = await Booking.create({
      user: req.user._id,
      service: service._id,
      serviceLabel,
      petName,
      petType,
      petSize: petSize || '',
      date,
      time: time || '',
      notes: notes || '',
      addons: addonsArray,
      status: 'Pending'
    });

    // Send confirmation email
    sendBookingConfirmation(req.user, booking);

    logActivity(req.user._id, 'CREATE_BOOKING', 'Booking', booking._id.toString(), `Booked: ${service.name}`, req.ip);

    successResponse(res, booking, 'Booking created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Auth
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id, isDeleted: false })
      .populate('service', 'name value price')
      .sort({ createdAt: -1 });

    successResponse(res, bookings, 'Bookings fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Admin
export const getAllBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.search) {
      query.$or = [
        { bookingId: { $regex: req.query.search, $options: 'i' } },
        { petName: { $regex: req.query.search, $options: 'i' } },
        { serviceLabel: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('service', 'name value price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    paginatedResponse(res, bookings, page, limit, total, 'Bookings fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Auth
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('service', 'name value price');

    if (!booking || booking.isDeleted) {
      return errorResponse(res, 'Booking not found', 404);
    }

    // Ensure user can only see their own bookings (unless admin)
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized', 403);
    }

    successResponse(res, booking, 'Booking fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Approve booking (Confirmed)
// @route   PUT /api/bookings/:id/approve
// @access  Admin
export const approveBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return errorResponse(res, 'Booking not found', 404);
    }

    booking.status = 'Confirmed';
    await booking.save();

    // Send status email
    const user = await User.findById(booking.user);
    if (user) sendBookingStatusEmail(user, booking);

    logActivity(req.user._id, 'APPROVE_BOOKING', 'Booking', req.params.id, `Approved booking ${booking.bookingId}`, req.ip);

    successResponse(res, booking, 'Booking approved');
  } catch (error) {
    next(error);
  }
};

// @desc    Complete booking
// @route   PUT /api/bookings/:id/complete
// @access  Admin
export const completeBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return errorResponse(res, 'Booking not found', 404);
    }

    booking.status = 'Completed';
    await booking.save();

    const user = await User.findById(booking.user);
    if (user) sendBookingStatusEmail(user, booking);

    logActivity(req.user._id, 'COMPLETE_BOOKING', 'Booking', req.params.id, `Completed booking ${booking.bookingId}`, req.ip);

    successResponse(res, booking, 'Booking completed');
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Auth
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return errorResponse(res, 'Booking not found', 404);
    }

    // Users can only cancel their own bookings
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized', 403);
    }

    if (booking.status === 'Cancelled') {
      return errorResponse(res, 'Booking is already cancelled', 400);
    }

    booking.status = 'Cancelled';
    await booking.save();

    const user = await User.findById(booking.user);
    if (user) sendBookingStatusEmail(user, booking);

    logActivity(req.user._id, 'CANCEL_BOOKING', 'Booking', req.params.id, `Cancelled booking ${booking.bookingId}`, req.ip);

    successResponse(res, booking, 'Booking cancelled');
  } catch (error) {
    next(error);
  }
};
