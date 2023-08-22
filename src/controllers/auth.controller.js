const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');
const generateJWT = require('./../utils/jwt');
const storage = require('../utils/firebase');
const User = require('./../models/user.model');

const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body; //description
  /*
  if (!req.file) {
    return next(new AppError('Please upload a file', 400));
  } 

  const imgRef = ref(storage, `users/${Date.now()}-${req.file.originalname}`);
  const imgUpload = await uploadBytes(imgRef, req.file.buffer);
*/
  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  console.log('antes model');

  const user = await User.create({
    name: name.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    password: encryptedPassword,
    role, //description,
    //profileImgUrl: imgUpload.metadata.fullPath,
  });

  console.log('despues model');
  const tokenPromise = generateJWT(user.id); //aqui tenia un await pero se elimino para ganar tiempo, se resuelve despues con un Promise.all para varios await, y se puede hacer esto solo si no se necesita en el camino antes.
  /*
  const imgRefToDownload = ref(storage, user.profileImgUrl);
  const urlPromise = getDownloadURL(imgRefToDownload); // se quita el await y se anade la palabra Promise para indicar que aqui se resolvera despues con el Promise.all
*/
  const [token] = await Promise.all([tokenPromise]); // el token que se obtenia antes, se obtiene ahora en este momento.

  //user.profileImgUrl = url;        //, urlPromise  //, url

  res.status(200).json({
    status: 'success',
    message: 'The user has been created',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      //description: user.description,
      // profileImgUrl: user.profileImgUrl,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  //1. traernos la informacion de la req.body
  const { email, password } = req.body;

  //2. buscar el usuario y revisar si existe
  const user = await User.findOne({
    where: {
      email: email.toLowerCase().trim(),
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError(`User with email: ${email} not found`, 404));
  }
  //3. validar si la contraseña es correcta
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //4. generar el token
  const tokenPromise = generateJWT(user.id);
  /*
  const imgRef = ref(storage, user.profileImgUrl);
  const urlPromise = getDownloadURL(imgRef);
*/
  const [token] = await Promise.all([tokenPromise]);

  //user.profileImgUrl = url; //, urlPromise  //, url

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      //description: user.description,
      //profileImgUrl: user.profileImgUrl,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1. traerme el usuario que viene de la req, del midleware
  const { user } = req;

  //2. traerme los datos de la req.body
  const { currentPassword, newPassword } = req.body;

  //3. validar si la contraseña actual y nueva son iguales enviar un error
  if (currentPassword === newPassword) {
    return next(new AppError('The password cannot be equals', 400));
  }

  //4. validar si la contraseña actual es igual a la contraseña en bd
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  //5. encriptar la nueva contraseña
  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(newPassword, salt);

  //6. actualizar el usuario que viene de la req
  await user.update({
    password: encryptedPassword,
    passwordChangedAt: new Date(),
  });

  //7. enviar el mensaje al cliente
  return res.status(200).json({
    status: 'success',
    message: 'The user password was updated successfully',
  });
});
