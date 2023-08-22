const User = require('../models/user.model');
const storage = require('../utils/firebase');
const catchAsync = require('./../utils/catchAsync');
const { ref, getDownloadURL } = require('firebase/storage');

exports.findAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      status: 'active',
    },
  });

  const usersPromises = users.map(async (user) => {
    //obtenemos la referencia
    const imgRef = ref(storage, user.profileImgUrl);
    //nos traemos la url
    const url = await getDownloadURL(imgRef);
    //hacemos el cambio del path por la url
    user.profileImgUrl = url;
    //retornamos el usuario
    return user;
  });

  const userResolved = await Promise.all(usersPromises); //Resuelve todas las promesas

  res.status(200).json({
    status: 'success',
    users: userResolved,
  });
});

exports.findOneUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const imgRef = ref(storage, user.profileImgUrl);
  const url = await getDownloadURL(imgRef);

  res.status(200).json({
    status: 'success',
    user: {
      name: user.name,
      email: user.email,
      description: user.description,
      profileImgUrl: url,
      role: user.role,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body; //description

  await user.update({ name, email }); //description

  res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'inactive' });

  return res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
  });
});
