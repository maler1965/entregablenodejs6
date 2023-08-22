const AppError = require('../utils/appError');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

exports.validUser = catchAsync(async (req, res, next) => {
  //1. traer el id de la req.params, este es el id del usuario
  const { id } = req.params;

  //2. buscar el usuario con status active y el id recibido
  const user = await User.findOne({
    where: {
      id,
      status: 'active', // true
    },
  });

  //3. valido que si no existe envio el error
  if (!user) {
    return next(new AppError(`User with id: ${id} not found`, 404));
  }
  //4. adjunto el usuario por la req, y le doy paso para que avance con el next
  req.user = user;
  next();
});

exports.validUserOwner = catchAsync(async (req, res, next) => {
  //1. traer el id de la req.params, este es el id del usuario
  //const { id } = req.params;
  const { sessionUser } = req;

  if (user.id !== sessionUser.id) {
    return next(new AppError('You do not own this account.', 401));
  }
  //2. buscar el usuario con status active y el id recibido
  const user = await User.findOne({
    where: {
      id: sessionUser.id,
      status: 'active',
    },
  });

  //3. valido que si no existe envio el error
  if (!user) {
    return next(new AppError(`User with id: ${id} not found`, 404));
  }
  //4. adjunto el usuario por la req, y le doy paso para que avance con el next
  req.user = user;
  next();
});
