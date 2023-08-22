const express = require('express');

//controllers
const userController = require('./../controllers/user.controller');
const orderController = require('./../controllers/orders.controller');
const authController = require('./../controllers/auth.controller');

//middlewares
const userMiddleware = require('./../middlewares/user.middleware');
const validationMiddleware = require('./../middlewares/validations.middleware');
const authMiddleware = require('./../middlewares/auth.middleware');

const router = express.Router();

router.post(
  '/signup',
  validationMiddleware.createUserValidation,
  authController.signUp
);

router.post(
  '/login',
  validationMiddleware.loginUserValidation,
  authController.login
);

router.use(authMiddleware.protect);

router
  .get('/', userController.findAllUsers)
  .get('/orders', orderController.findAllOrders);

router.get('/orders/:id', orderController.findMyOrders);

router
  .route('/:id')
  .get(
    userMiddleware.validUser,
    authMiddleware.protectAccountOwner,
    userController.findOneUser
  )
  .patch(
    userMiddleware.validUser,
    validationMiddleware.updateUserValidation,
    authMiddleware.protectAccountOwner,
    userController.updateUser
  )
  .delete(
    userMiddleware.validUser,
    authMiddleware.protectAccountOwner,
    userController.deleteUser
  );

module.exports = router;
