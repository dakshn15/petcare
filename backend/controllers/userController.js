import User from '../models/User.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import logActivity from '../services/activityService.js';

// @desc    Create user (admin)
// @route   POST /api/users
// @access  Admin
export const createUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check if email already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return errorResponse(res, 'A user with this email address already exists', 400);
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'customer'
    });

    logActivity(req.user._id, 'CREATE_USER', 'User', user._id, `Admin created user: ${user.email}`, req.ip);

    // Remove sensitive fields
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    };

    successResponse(res, userData, 'User created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Admin
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = { isDeleted: false };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (req.query.role) {
      query.role = req.query.role;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    paginatedResponse(res, users, page, limit, total, 'Users fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.isDeleted) {
      return errorResponse(res, 'User not found', 404);
    }
    successResponse(res, user, 'User fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (admin)
// @route   PUT /api/users/:id
// @access  Admin
export const updateUser = async (req, res, next) => {
  try {
    const { name, phone, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    logActivity(req.user._id, 'UPDATE_USER', 'User', req.params.id, `Updated user: ${user.email}`, req.ip);

    successResponse(res, user, 'User updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete user
// @route   DELETE /api/users/:id
// @access  Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Don't allow deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return errorResponse(res, 'Cannot delete your own account', 400);
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save({ validateBeforeSave: false });

    logActivity(req.user._id, 'DELETE_USER', 'User', req.params.id, `Soft-deleted user: ${user.email}`, req.ip);

    successResponse(res, null, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};
