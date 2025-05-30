import { body } from 'express-validator'

export const loginValidator = [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Invalid password').isLength({ min: 5, max: 35 }),
];

export const registerValidator = [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Invalid password').isLength({ min: 5, max: 35 }),
    body('fullName', 'Full name must be between 2 and 35 characters').isLength({ min: 2, max: 35 }),
    body('avatarUrl').optional({ checkFalsy: true }).isURL(),
];

export const postCreateValidator = [
    body('title')
        .isString().withMessage('Title must be a string')
        .isLength({ min: 3 }).withMessage('Enter a title (minimum 3 characters)'),

    body('text')
        .isString().withMessage('Text must be a string')
        .isLength({ min: 10 }).withMessage('Enter post content (minimum 10 characters)'),

    body('tags')
        .optional()
        .isArray().withMessage('Invalid tags format (must be an array)'),

    body('tags.*')
        .isString().withMessage('Each tag must be a string'),

    body('imageUrl')
        .optional()
        .isString().withMessage('Invalid image URL')
];
