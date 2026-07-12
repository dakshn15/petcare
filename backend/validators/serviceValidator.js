import { body } from 'express-validator';

export const serviceValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Service name is required'),
  body('value')
    .trim()
    .notEmpty()
    .withMessage('Service slug is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
];
