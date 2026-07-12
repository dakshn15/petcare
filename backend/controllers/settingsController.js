import WebsiteSettings from '../models/WebsiteSettings.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import logActivity from '../services/activityService.js';

// @desc    Get website settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSettings.findOne();

    if (!settings) {
      // Create default settings if none exist
      settings = await WebsiteSettings.create({});
    }

    successResponse(res, settings, 'Settings fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Update website settings
// @route   PUT /api/settings
// @access  Admin
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSettings.findOne();

    if (!settings) {
      settings = await WebsiteSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }

    logActivity(req.user._id, 'UPDATE_SETTINGS', 'WebsiteSettings', settings._id.toString(), 'Website settings updated', req.ip);

    successResponse(res, settings, 'Settings updated');
  } catch (error) {
    next(error);
  }
};
