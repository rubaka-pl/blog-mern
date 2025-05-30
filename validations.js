import { body } from 'express-validator'

export const loginValidator = [
    body('email', 'Неверный Email').isEmail(),
    body('password', 'Неверный Пароль').isLength({ min: 5, max: 35 }),
];

export const registerValidator = [
    body('email', 'Неверный Email').isEmail(),
    body('password', 'Неверный Пароль').isLength({ min: 5, max: 35 }),
    body('fullName', 'Имя должно содержать от 2 до 35 символов').isLength({ min: 2, max: 35 }),
    body('avatarUrl').optional({ checkFalsy: true }).isURL(),
];

export const postCreateValidator = [
    body('title')
        .isString().withMessage('Заголовок должен быть строкой')
        .isLength({ min: 3 }).withMessage('Введите заголовок статьи (не менее 3 символов)'),

    body('text')
        .isString().withMessage('Текст статьи должен быть строкой')
        .isLength({ min: 3 }).withMessage('Введите текст статьи (не менее 10 символов)'),

    body('tags')
        .optional()
        .isArray().withMessage('Неверный формат тэгов (должен быть массив)'),

    body('tags.*')
        .isString().withMessage('Каждый тег должен быть строкой'),

    body('imageUrl')
        .optional()
        .isString().withMessage('Неверная ссылка на изображение')
];
