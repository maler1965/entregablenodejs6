const express = require('express');

//controllers
//const restaurantController = require('../controllers/restaurant.controller');
const orderController = require('../controllers/orders.controller');

//middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');
//const restaurantMiddleware = require('../middlewares/restaurant.middleware');
const orderMiddleware = require('../middlewares/order.middleware');

//const upload = require('../utils/multer');  validReview

const router = express.Router();

router
  .route('/') //.get(orderController.findAllOrder)
  .post(
    //L
    authMiddleware.protect,
    //authMiddleware.restrictTo('admin'),
    validationMiddleware.createOrderValidation,
    orderController.createOrder
  );

router.use(authMiddleware.protect); //L

router.get('/me', orderController.findMyOrders); //L

/*
router.get(
  '/profile/:id',
  userMiddleware.validUser,
  restaurantController.findUserRestaurant
);
*/

router
  .route('/:id')

  .patch(
    //L
    // authMiddleware.restrictTo('admin'),
    orderMiddleware.validOrder,
    // validationMiddleware.updateOrderValidation,
    //authMiddleware.protectAccountOwner,
    orderController.updateOrder
  )
  .delete(
    //authMiddleware.restrictTo('admin'),
    orderMiddleware.validOrder,
    //authMiddleware.protectAccountOwner,
    orderController.deleteOrder
  );

module.exports = router;
