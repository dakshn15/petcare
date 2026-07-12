import Pet from '../models/Pet.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import logActivity from '../services/activityService.js';

// @desc    Get all available pets (public)
// @route   GET /api/pets
// @access  Public
export const getPets = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };

    if (req.query.status) {
      query.status = req.query.status;
    } else {
      query.status = 'Available';
    }

    if (req.query.type) {
      query.type = req.query.type;
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { breed: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await Pet.countDocuments(query);
    const pets = await Pet.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    paginatedResponse(res, pets, page, limit, total, 'Pets fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Get pet by ID
// @route   GET /api/pets/:id
// @access  Public
export const getPet = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet || pet.isDeleted) {
      return errorResponse(res, 'Pet not found', 404);
    }
    successResponse(res, pet, 'Pet fetched');
  } catch (error) {
    next(error);
  }
};

// @desc    Create pet
// @route   POST /api/pets
// @access  Admin
export const createPet = async (req, res, next) => {
  try {
    const petData = { ...req.body };

    if (req.file) {
      petData.image = `/uploads/${req.file.filename}`;
    }

    const pet = await Pet.create(petData);

    logActivity(req.user._id, 'CREATE_PET', 'Pet', pet._id.toString(), `Added pet: ${pet.name}`, req.ip);

    successResponse(res, pet, 'Pet created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Admin
export const updatePet = async (req, res, next) => {
  try {
    const petData = { ...req.body };

    if (req.file) {
      petData.image = `/uploads/${req.file.filename}`;
    }

    const pet = await Pet.findByIdAndUpdate(req.params.id, petData, {
      new: true,
      runValidators: true
    });

    if (!pet) {
      return errorResponse(res, 'Pet not found', 404);
    }

    logActivity(req.user._id, 'UPDATE_PET', 'Pet', req.params.id, `Updated pet: ${pet.name}`, req.ip);

    successResponse(res, pet, 'Pet updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pet (soft delete)
// @route   DELETE /api/pets/:id
// @access  Admin
export const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return errorResponse(res, 'Pet not found', 404);
    }

    pet.isDeleted = true;
    pet.deletedAt = new Date();
    await pet.save();

    logActivity(req.user._id, 'DELETE_PET', 'Pet', req.params.id, `Deleted pet: ${pet.name}`, req.ip);

    successResponse(res, null, 'Pet deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pets for admin (includes all statuses)
// @route   GET /api/pets/admin/all
// @access  Admin
export const getAllPetsAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };

    if (req.query.status) {
      query.status = req.query.status;
    }

    const total = await Pet.countDocuments(query);
    const pets = await Pet.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    paginatedResponse(res, pets, page, limit, total, 'All pets fetched');
  } catch (error) {
    next(error);
  }
};
