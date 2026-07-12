import FAQ from '../models/FAQ.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import logActivity from '../services/activityService.js';

// @desc    Get active FAQs (public)
// @route   GET /api/faqs
// @access  Public
export const getFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find({ isActive: true })
      .sort({ category: 1, order: 1 });

    // Group by category
    const grouped = faqs.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = {
          category: faq.category,
          icon: faq.categoryIcon,
          items: []
        };
      }
      acc[faq.category].items.push(faq);
      return acc;
    }, {});

    successResponse(res, Object.values(grouped), 'FAQs fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all FAQs (admin)
// @route   GET /api/faqs/all
// @access  Admin
export const getAllFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find().sort({ category: 1, order: 1 });
    successResponse(res, faqs, 'All FAQs fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Create FAQ
// @route   POST /api/faqs
// @access  Admin
export const createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);

    logActivity(req.user._id, 'CREATE_FAQ', 'FAQ', faq._id.toString(), `Created FAQ: ${faq.question.substring(0, 50)}`, req.ip);

    successResponse(res, faq, 'FAQ created', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Admin
export const updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!faq) {
      return errorResponse(res, 'FAQ not found', 404);
    }

    logActivity(req.user._id, 'UPDATE_FAQ', 'FAQ', req.params.id, `Updated FAQ`, req.ip);

    successResponse(res, faq, 'FAQ updated');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Admin
export const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return errorResponse(res, 'FAQ not found', 404);
    }

    logActivity(req.user._id, 'DELETE_FAQ', 'FAQ', req.params.id, `Deleted FAQ`, req.ip);

    successResponse(res, null, 'FAQ deleted');
  } catch (error) {
    next(error);
  }
};
