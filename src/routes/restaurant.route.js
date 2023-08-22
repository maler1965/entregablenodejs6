const express = require('express');

//controllers
const restaurantController = require('../controllers/restaurant.controller');
const reviewsController = require('../controllers/reviews.controller');

//middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');
const restaurantMiddleware = require('../middlewares/restaurant.middleware');
const reviewsMiddleware = require('../middlewares/reviews.middleware');

//const upload = require('../utils/multer');  validReview

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

//router.get('/me', restaurantController.findMyRestaurant);  reviews

/*
router.get(
  '/profile/:id',
  userMiddleware.validUser,
  restaurantController.findUserRestaurant
);
*/

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
    //authMiddleware.protectAccountOwner,
    restaurantController.updateRestaurant
  )
  .delete(
    authMiddleware.restrictTo('admin'),
    restaurantMiddleware.validRestaurant,
    //authMiddleware.protectAccountOwner,
    restaurantController.deleteRestaurant
  );

router.route('/reviews/:id').post(
  //:id del restaurante
  //'/reviews/:id',
  //authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  restaurantMiddleware.validRestaurant,
  validationMiddleware.createReviewValidation,
  reviewsController.createReview
);

router
  .route('/reviews/:restaurantId/:id') //:id de la reviews
  .patch(
    authMiddleware.restrictTo('admin'),
    reviewsMiddleware.validReview,
    validationMiddleware.updateReviewValidation,
    restaurantMiddleware.validRestaurant,
    //authMiddleware.protectAccountOwner,
    reviewsController.updateReview
  )
  .delete(
    authMiddleware.restrictTo('admin'),
    reviewsMiddleware.validReview,
    restaurantMiddleware.validRestaurant,
    //authMiddleware.protectAccountOwner,
    reviewsController.deleteReview
  );

module.exports = router;
