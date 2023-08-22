const catchAsync = require('../utils/catchAsync');
const { Restaurant, postStatus } = require('../models/restaurants.model');
const AppError = require('../utils/appError');

exports.validRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: {
      status: postStatus.active,
      id,
    },
  });

  if (!restaurant) {
    return next(new AppError(`Post with id: ${id} not found`, 404));
  }

  req.restaurant = restaurant;
  next();
});
