const express = require('express');

//controllers
const userController = require('./../controllers/user.controller');
const orderController = require('./../controllers/orders.controller');
const authController = require('./../controllers/auth.controller');

//middlewares
const userMiddleware = require('./../middlewares/user.middleware');
//const orderController = require('./../middlewares/orders.middleware');
const validationMiddleware = require('./../middlewares/validations.middleware');
const authMiddleware = require('./../middlewares/auth.middleware');

//const upload = require('./../utils/multer');

const router = express.Router();
//============
router.post(
  '/signup',
  //upload.single('profileImgUrl'), //profileImgUrl es el nombre que nosotros le damos a la imagen, y se pone single porque solo vamos a guardar una imagen
  validationMiddleware.createUserValidation,
  authController.signUp
);

router.post(
  '/login',
  validationMiddleware.loginUserValidation,
  authController.login
);

router.use(authMiddleware.protect); //L        // (authMiddleware.restrictTo('admin')

router.patch(
  '/password/:id',
  validationMiddleware.updatePasswordValidation,
  userMiddleware.validUser,
  authMiddleware.protectAccountOwner,
  authController.updatePassword
);

//===============

//router.use(authMiddleware.protect);

router
  .get('/', userController.findAllUsers)
  .get('/orders', orderController.findAllOrders);
// router.use('/:id', userMiddleware.validUser);
router.get(
  '/orders/:id',
  //authMiddleware.protectAccountOwner,
  orderController.findMyOrders
);
// router.use(authMiddleware.restrictTo('admin', 'user'));

router
  //.use('/:id', userMiddleware.validUser) //L

  .route('/:id')
  .get(
    userMiddleware.validUser,
    authMiddleware.protectAccountOwner,
    userController.findOneUser
  )
  //L
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
  ); //listo

module.exports = router;
