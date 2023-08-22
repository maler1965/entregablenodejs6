const catchAsync = require('../utils/catchAsync');
const { Meal } = require('../models/meals.model');
const AppError = require('../utils/appError');

exports.validMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meal.findOne({
    where: {
      status: true,
      id,
    },
  });

  if (!meal) {
    return next(new AppError(`Meal with id: ${id} not found`, 404));
  }

  req.meal = meal;
  next();
});
