import ContactMessage from '../models/ContactMessage.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import logActivity from '../services/activityService.js';

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
export const submitMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const contactMessage = await ContactMessage.create({ name, email, subject, message });

    successResponse(res, contactMessage, 'Message sent successfully! We will get back to you within 24 hours.', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages (admin)
// @route   GET /api/contact
// @access  Admin
export const getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };

    if (req.query.status === 'read') query.isRead = true;
    if (req.query.status === 'unread') query.isRead = false;

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { subject: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await ContactMessage.countDocuments(query);
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    paginatedResponse(res, messages, page, limit, total, 'Messages fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read
// @route   PUT /api/contact/:id/read
// @access  Admin
export const markAsRead = async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return errorResponse(res, 'Message not found', 404);
    }

    successResponse(res, message, 'Message marked as read');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/contact/:id
// @access  Admin
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return errorResponse(res, 'Message not found', 404);
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    logActivity(req.user._id, 'DELETE_CONTACT', 'ContactMessage', req.params.id, `Deleted message from ${message.name}`, req.ip);

    successResponse(res, null, 'Message deleted');
  } catch (error) {
    next(error);
  }
};
