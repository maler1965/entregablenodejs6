const { body, validationResult } = require('express-validator');

const validFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }

  next();
};

exports.updateUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a correct format'),
  validFields,
];

exports.createUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a correct format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must have cotain a least one letter'),
  body('role').notEmpty().withMessage('Role is required'),
  validFields,
];

exports.loginUserValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a correct format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must have cotain a least one letter'),
  validFields,
];

exports.updatePasswordValidation = [
  body('currentPassword')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must have cotain a least one letter'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must have cotain a least one letter'),
  validFields,
];

exports.createRestaurantValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .custom((value) => {
      const rating = parseInt(value);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        throw new Error('Rating must be a number between 1 and 5');
      }
      return true;
    }),
  validFields,
];

exports.createReviewValidation = [
  body('comment').notEmpty().withMessage('Comment is required'),
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .custom((value) => {
      const rating = parseInt(value);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        throw new Error('Rating must be a number between 1 and 5');
      }
      return true;
    }),
  validFields,
];

exports.createMealValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').notEmpty().withMessage('Price is required'),
  validFields,
];

exports.createOrderValidation = [
  body('quantity').notEmpty().withMessage('Quantity is required'),
  body('mealId').notEmpty().withMessage('MealId is required'),
  validFields,
];

exports.updateMealValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').notEmpty().withMessage('Price is required'),
  validFields,
];

exports.updateReviewValidation = [
  body('comment').notEmpty().withMessage('Comment is required'),
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .custom((value) => {
      const rating = parseInt(value);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        throw new Error('Rating must be a number between 1 and 5');
      }
      return true;
    }),
  validFields,
];

exports.updateRestaurantValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  validFields,
];
