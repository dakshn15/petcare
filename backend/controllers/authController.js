import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { generateAccessToken, sendTokenResponse } from '../utils/tokenUtils.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService.js';
import logActivity from '../services/activityService.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 'An account with this email address already exists.', 400);
    }

    // Create user
    const user = await User.create({ name, email, phone, password });

    // Log activity
    logActivity(user._id, 'REGISTER', 'User', user._id.toString(), `New user registered: ${email}`, req.ip);

    // Send welcome email (fire-and-forget)
    sendWelcomeEmail(user);

    // Send token response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide email and password', 400);
    }

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase(), isDeleted: false }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    // Log activity
    logActivity(user._id, 'LOGIN', 'User', user._id.toString(), `User logged in`, req.ip);

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Auth
export const logout = async (req, res, next) => {
  try {
    res
      .cookie('accessToken', '', { httpOnly: true, expires: new Date(0) })
      .cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) })
      .json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return errorResponse(res, 'No refresh token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.isDeleted) {
      return errorResponse(res, 'Invalid refresh token', 401);
    }

    const accessToken = generateAccessToken(user._id);

    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000
      })
      .json({ success: true, accessToken });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Invalid or expired refresh token', 401);
    }
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Auth
export const getProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return successResponse(res, null, 'Not logged in');
    }
    const user = await User.findById(req.user._id);
    successResponse(res, user, 'Profile fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Auth
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    );

    logActivity(req.user._id, 'UPDATE_PROFILE', 'User', req.user._id.toString(), 'Profile updated');

    successResponse(res, user, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Auth
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    user.password = newPassword;
    await user.save();

    logActivity(req.user._id, 'UPDATE_PASSWORD', 'User', req.user._id.toString(), 'Password updated');

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload avatar
// @route   PUT /api/auth/avatar
// @access  Auth
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'Please upload an image file', 400);
    }

    const avatarPath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarPath },
      { new: true }
    );

    logActivity(req.user._id, 'UPLOAD_AVATAR', 'User', req.user._id.toString(), 'Avatar uploaded');

    successResponse(res, user, 'Avatar uploaded successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase(), isDeleted: false });

    if (!user) {
      return successResponse(res, null, 'If that email exists, a reset link has been sent');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    // Build reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email
    await sendPasswordResetEmail(user, resetUrl);

    successResponse(res, null, 'If that email exists, a reset link has been sent');
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return errorResponse(res, 'Invalid or expired reset token', 400);
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    logActivity(user._id, 'RESET_PASSWORD', 'User', user._id.toString(), 'Password reset via email');

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};
