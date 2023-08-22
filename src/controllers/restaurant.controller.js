const catchAsync = require('../utils/catchAsync');
const { Restaurant, postStatus } = require('../models/restaurants.model');

exports.findAllRestaurant = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    where: {
      status: postStatus.active,
    },
  });

  return res.status(200).json({
    status: 'success',
    results: restaurants.length,
    restaurants,
  });
});

exports.findUserRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.query;

  //para evitar ataques de SQL reemplazar las variables que tenga concatenadas ${id} por ejemplo, con :iduser es decir con una variable aparte con una variable de reemplazo
  const query = `SELECT id, title, content, "createdAt", "updatedAt"  FROM posts WHERE "userId" = :iduser AND status = :status`;

  const [rows, fields] = await db.query(query, {
    replacements: { iduser: id, status: status }, //es la variable de reemplazo de las variables que tenia arriba
  });

  return res.status(200).json({
    status: 'success',
    results: fields.rowCount,
    restaurants: rows,
  });
});

exports.findMyRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;

  const restaurants = await Restaurant.findAll({
    where: {
      status: postStatus.active,
      userId: id,
    },
  });

  return res.status(200).json({
    status: 'success',
    results: restaurants.length,
    restaurants,
  });
});

exports.createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const restaurant = await Restaurant.create({ name, address, rating });

  return res.status(201).json({
    status: 'success',
    message: 'Restaurant created successfully',
    restaurant,
  });
});

exports.findOneRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  return res.status(200).json({
    status: 'success',
    restaurant,
  });
});

exports.updateRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, address } = req.body;

  await restaurant.update({ name, address });

  return res.status(200).json({
    status: 'success',
    message: 'Restaurant updated successfully',
  });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: postStatus.disabled });

  return res.status(200).json({
    status: 'success',
    message: 'Restaurant deleted successfully',
  });
});
