import AdoptionApplication from '../models/AdoptionApplication.js';
import User from '../models/User.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { sendAdoptionStatusEmail } from '../services/emailService.js';
import logActivity from '../services/activityService.js';

// @desc    Submit adoption application
// @route   POST /api/adoptions
// @access  Auth
export const submitApplication = async (req, res, next) => {
  try {
    const { petType, breed, ageRange, gender, size, address, reason } = req.body;

    const application = await AdoptionApplication.create({
      user: req.user._id,
      petType,
      breed: breed || '',
      ageRange: ageRange || '',
      gender: gender || '',
      size: size || '',
      address,
      reason
    });

    logActivity(req.user._id, 'SUBMIT_ADOPTION', 'Adoption', application._id.toString(), `Adoption application for ${petType}`, req.ip);

    successResponse(res, application, 'Application submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's adoptions
// @route   GET /api/adoptions/my
// @access  Auth
export const getMyAdoptions = async (req, res, next) => {
  try {
    const adoptions = await AdoptionApplication.find({ user: req.user._id, isDeleted: false })
      .sort({ createdAt: -1 });

    successResponse(res, adoptions, 'Adoptions fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (admin)
// @route   GET /api/adoptions
// @access  Admin
export const getAllApplications = async (req, res, next) => {
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
        { applicationId: { $regex: req.query.search, $options: 'i' } },
        { petType: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await AdoptionApplication.countDocuments(query);
    const applications = await AdoptionApplication.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    paginatedResponse(res, applications, page, limit, total, 'Applications fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Approve adoption
// @route   PUT /api/adoptions/:id/approve
// @access  Admin
export const approveApplication = async (req, res, next) => {
  try {
    const application = await AdoptionApplication.findById(req.params.id);
    if (!application) {
      return errorResponse(res, 'Application not found', 404);
    }

    application.status = 'Approved';
    await application.save();

    const user = await User.findById(application.user);
    if (user) sendAdoptionStatusEmail(user, application);

    logActivity(req.user._id, 'APPROVE_ADOPTION', 'Adoption', req.params.id, `Approved ${application.applicationId}`, req.ip);

    successResponse(res, application, 'Application approved');
  } catch (error) {
    next(error);
  }
};

// @desc    Reject adoption
// @route   PUT /api/adoptions/:id/reject
// @access  Admin
export const rejectApplication = async (req, res, next) => {
  try {
    const application = await AdoptionApplication.findById(req.params.id);
    if (!application) {
      return errorResponse(res, 'Application not found', 404);
    }

    application.status = 'Rejected';
    await application.save();

    const user = await User.findById(application.user);
    if (user) sendAdoptionStatusEmail(user, application);

    logActivity(req.user._id, 'REJECT_ADOPTION', 'Adoption', req.params.id, `Rejected ${application.applicationId}`, req.ip);

    successResponse(res, application, 'Application rejected');
  } catch (error) {
    next(error);
  }
};
