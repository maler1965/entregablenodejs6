const express = require('express');

//controllers
const mealController = require('../controllers/meal.controller');

//middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');
const mealMiddleware = require('../middlewares/meal.middleware');
const restaurantMiddleware = require('../middlewares/restaurant.middleware');

const router = express.Router();

router.route('/').get(mealController.findAllMeal);

router.use(authMiddleware.protect);

router
  .route('/:id')
  .post(
    authMiddleware.restrictTo('admin'),
    restaurantMiddleware.validRestaurant,
    validationMiddleware.createMealValidation,
    mealController.createMeal
  );

router
  .route('/:id')
  .get(mealMiddleware.validMeal, mealController.findOneMeal)
  .patch(
    authMiddleware.restrictTo('admin'),
    mealMiddleware.validMeal,
    validationMiddleware.updateMealValidation,
    mealController.updateMeal
  )
  .delete(
    authMiddleware.restrictTo('admin'),
    mealMiddleware.validMeal,
    mealController.deleteMeal
  );

module.exports = router;
