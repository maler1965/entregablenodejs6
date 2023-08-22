const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviews.model');

exports.createReview = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const uId = req.sessionUser.id;
  const rId = req.restaurant.id;

  const review = await Review.create({
    comment,
    rating,
    userId: uId,
    restaurantId: rId,
  });

  return res.status(201).json({
    status: 'success',
    message: 'Review created successfully',
    review,
  });
});

exports.findOneReviews = catchAsync(async (req, res, next) => {
  const { comment } = req;

  return res.status(200).json({
    status: 'success',
    comment,
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const { review } = req;
  const { comment, rating } = req.body;

  await review.update({ comment, rating });

  return res.status(200).json({
    status: 'success',
    message: 'Review updated successfully',
    review,
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.update({
    status: false,
  });

  return res.status(200).json({
    status: 'success',
    message: 'Review deleted successfully',
    review,
  });
});
