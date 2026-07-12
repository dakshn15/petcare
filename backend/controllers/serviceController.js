import Service from '../models/Service.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import logActivity from '../services/activityService.js';

// @desc    Get all active services (public)
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const query = { isActive: true, isDeleted: false };

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    const total = await Service.countDocuments(query);
    const services = await Service.find(query)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    paginatedResponse(res, services, page, limit, total, 'Services fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get service by slug value
// @route   GET /api/services/:value
// @access  Public
export const getService = async (req, res, next) => {
  try {
    const service = await Service.findOne({ value: req.params.value, isDeleted: false });
    if (!service) {
      return errorResponse(res, 'Service not found', 404);
    }
    successResponse(res, service, 'Service fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Create service
// @route   POST /api/services
// @access  Admin
export const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);

    logActivity(req.user._id, 'CREATE_SERVICE', 'Service', service._id.toString(), `Created service: ${service.name}`, req.ip);

    successResponse(res, service, 'Service created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Admin
export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return errorResponse(res, 'Service not found', 404);
    }

    logActivity(req.user._id, 'UPDATE_SERVICE', 'Service', req.params.id, `Updated service: ${service.name}`, req.ip);

    successResponse(res, service, 'Service updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service (soft delete)
// @route   DELETE /api/services/:id
// @access  Admin
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return errorResponse(res, 'Service not found', 404);
    }

    service.isDeleted = true;
    service.deletedAt = new Date();
    await service.save();

    logActivity(req.user._id, 'DELETE_SERVICE', 'Service', req.params.id, `Deleted service: ${service.name}`, req.ip);

    successResponse(res, null, 'Service deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all services (admin - includes inactive/deleted)
// @route   GET /api/services/admin/all
// @access  Admin
export const getAllServicesAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };

    const total = await Service.countDocuments(query);
    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    paginatedResponse(res, services, page, limit, total, 'All services fetched');
  } catch (error) {
    next(error);
  }
};
