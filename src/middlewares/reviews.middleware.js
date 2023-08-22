const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Review = require('../models/reviews.model');

exports.validReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findOne({
    where: {
      status: true,
      id,
    },
  });

  if (!review) {
    return next(new AppError(`Post with id: ${id} not found`, 404));
  }

  req.review = review;
  next();
});
