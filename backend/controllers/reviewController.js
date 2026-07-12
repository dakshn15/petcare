import Review from '../models/Review.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import logActivity from '../services/activityService.js';

// @desc    Get approved reviews (public)
// @route   GET /api/reviews
// @access  Public
export const getApprovedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: true, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(20);

    successResponse(res, reviews, 'Reviews fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (admin)
// @route   GET /api/reviews/all
// @access  Admin
export const getAllReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };

    if (req.query.status === 'approved') query.isApproved = true;
    if (req.query.status === 'pending') query.isApproved = false;

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    paginatedResponse(res, reviews, page, limit, total, 'All reviews fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Auth
export const createReview = async (req, res, next) => {
  try {
    const { name, email, rating, text } = req.body;

    // Check if authenticated user already submitted a review
    if (req.user) {
      const userReview = await Review.findOne({ user: req.user._id, isDeleted: false });
      if (userReview) {
        return errorResponse(res, 'You have already submitted a review.', 400);
      }
    }

    // Check by email to prevent double posting from the same email address
    const emailReview = await Review.findOne({ email: email.toLowerCase(), isDeleted: false });
    if (emailReview) {
      return errorResponse(res, 'A review has already been submitted with this email address.', 400);
    }

    const review = await Review.create({
      user: req.user ? req.user._id : null,
      name,
      email: email.toLowerCase(),
      rating,
      text,
      isApproved: false // Requires admin approval
    });

    logActivity(req.user?._id, 'CREATE_REVIEW', 'Review', review._id.toString(), `New review from ${name}`, req.ip);

    successResponse(res, review, 'Review submitted! It will appear after admin approval.', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve review
// @route   PUT /api/reviews/:id/approve
// @access  Admin
export const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      return errorResponse(res, 'Review not found', 404);
    }

    logActivity(req.user._id, 'APPROVE_REVIEW', 'Review', req.params.id, `Approved review from ${review.name}`, req.ip);

    successResponse(res, review, 'Review approved');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Admin
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return errorResponse(res, 'Review not found', 404);
    }

    review.isDeleted = true;
    review.deletedAt = new Date();
    await review.save();

    logActivity(req.user._id, 'DELETE_REVIEW', 'Review', req.params.id, `Deleted review from ${review.name}`, req.ip);

    successResponse(res, null, 'Review deleted');
  } catch (error) {
    next(error);
  }
};
