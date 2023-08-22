const express = require('express');

//controllers
//const restaurantController = require('../controllers/restaurant.controller');
const mealController = require('../controllers/meal.controller');
//const reviewsController = require('../controllers/reviews.controller');

//middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');
const mealMiddleware = require('../middlewares/meal.middleware');
const restaurantMiddleware = require('../middlewares/restaurant.middleware');

//const upload = require('../utils/multer');  validReview

const router = express.Router();

router.route('/').get(mealController.findAllMeal); //L

//L
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
  .route('/:id') //id del restaurante  //L

  .post(
    //L
    authMiddleware.restrictTo('admin'),
    restaurantMiddleware.validRestaurant,
    validationMiddleware.createMealValidation,
    mealController.createMeal
  );

/*
router.route('/:id').post(
  //:id del restaurante
  //'/reviews/:id',
  //authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  restaurantMiddleware.validRestaurant,
  validationMiddleware.createReviewValidation,
  reviewsController.createReview
);
*/
router
  .route('/:id') //:id de la meal
  .get(mealMiddleware.validMeal, mealController.findOneMeal)
  .patch(
    authMiddleware.restrictTo('admin'),
    mealMiddleware.validMeal,
    validationMiddleware.updateMealValidation,
    //mealMiddleware.validMeal,
    //authMiddleware.protectAccountOwner,
    mealController.updateMeal
  )
  .delete(
    authMiddleware.restrictTo('admin'),
    mealMiddleware.validMeal,
    //restaurantMiddleware.validRestaurant,
    //authMiddleware.protectAccountOwner,
    mealController.deleteMeal
  );

module.exports = router;
