const express = require('express');

//controllers
const orderController = require('../controllers/orders.controller');

//middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');
const orderMiddleware = require('../middlewares/order.middleware');

const router = express.Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    validationMiddleware.createOrderValidation,
    orderController.createOrder
  );

router.use(authMiddleware.protect);

router.get('/me', orderController.findMyOrders);

router
  .route('/:id')
  .patch(orderMiddleware.validOrder, orderController.updateOrder)
  .delete(orderMiddleware.validOrder, orderController.deleteOrder);

module.exports = router;
