import { body } from 'express-validator';

export const createAdoptionValidator = [
  body('petType')
    .trim()
    .notEmpty()
    .withMessage('Pet type is required'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason for adoption is required')
];
