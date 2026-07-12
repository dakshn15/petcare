import { body } from 'express-validator';

export const createBookingValidator = [
  body('serviceValue')
    .trim()
    .notEmpty()
    .withMessage('Service is required'),
  body('petName')
    .trim()
    .notEmpty()
    .withMessage('Pet name is required'),
  body('petType')
    .trim()
    .notEmpty()
    .withMessage('Pet type is required')
    .isIn(['dog', 'cat', 'other'])
    .withMessage('Pet type must be dog, cat, or other'),
  body('date')
    .trim()
    .notEmpty()
    .withMessage('Booking date is required')
];
