const catchAsync = require('../utils/catchAsync');
const { Meal } = require('../models/meals.model');

exports.findAllMeal = catchAsync(async (req, res, next) => {
  const meal = await Meal.findAll({
    where: {
      status: true,
    },
  });

  return res.status(200).json({
    status: 'success',
    results: meal.length,
    meal,
  });
});

exports.createMeal = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, price } = req.body;

  const meal = await Meal.create({ name, price, restaurantId: restaurant.id });

  return res.status(201).json({
    status: 'success',
    message: ' Meal created successfully',
    meal,
  });
});

exports.findOneMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  return res.status(200).json({
    status: 'success',
    meal,
  });
});

exports.updateMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;
  const { name, price } = req.body;

  await meal.update({ name, price });

  return res.status(200).json({
    status: 'success',
    message: 'Meal updated successfully',
    meal,
  });
});

exports.deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await meal.update({ status: false });

  return res.status(200).json({
    status: 'success',
    message: 'Meal deleted successfully',
    meal,
  });
});
