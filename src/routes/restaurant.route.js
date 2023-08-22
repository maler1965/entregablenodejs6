const express = require('express');

//controllers
const restaurantController = require('../controllers/restaurant.controller');
const reviewsController = require('../controllers/reviews.controller');

//middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');
const restaurantMiddleware = require('../middlewares/restaurant.middleware');
const reviewsMiddleware = require('../middlewares/reviews.middleware');

const router = express.Router();

router
  .route('/')
  .get(restaurantController.findAllRestaurant)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    validationMiddleware.createRestaurantValidation,
    restaurantController.createRestaurant
  );

router.use(authMiddleware.protect);

router
  .route('/:id')
  .get(
    restaurantMiddleware.validRestaurant,
    restaurantController.findOneRestaurant
  )
  .patch(
    authMiddleware.restrictTo('admin'),
    restaurantMiddleware.validRestaurant,
    validationMiddleware.updateRestaurantValidation,
    restaurantController.updateRestaurant
  )
  .delete(
    authMiddleware.restrictTo('admin'),
    restaurantMiddleware.validRestaurant,
    restaurantController.deleteRestaurant
  );

router
  .route('/reviews/:id')
  .post(
    authMiddleware.restrictTo('admin'),
    restaurantMiddleware.validRestaurant,
    validationMiddleware.createReviewValidation,
    reviewsController.createReview
  );

router
  .route('/reviews/:restaurantId/:id')
  .patch(
    authMiddleware.restrictTo('admin'),
    reviewsMiddleware.validReview,
    validationMiddleware.updateReviewValidation,
    restaurantMiddleware.validRestaurant,
    reviewsController.updateReview
  )
  .delete(
    authMiddleware.restrictTo('admin'),
    reviewsMiddleware.validReview,
    restaurantMiddleware.validRestaurant,
    reviewsController.deleteReview
  );

module.exports = router;
