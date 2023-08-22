const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviews.model');
//const { Op } = require('sequelize');

/*
exports.findAllComment = catchAsync(async (req, res, next) => {
  // const { initDate, endDate } = req.query;

  const comments = await Reviews.findAll({
    where: {
      status: true,
      // createdAt: {
      //   [Op.between]: [initDate, endDate],
      // },
    },
  });

  return res.status(200).json({
    status: 'success',
    results: comments.length,
    comments,
  });
});
*/

exports.createReview = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const uId = req.sessionUser.id; // const { id: userId } = req.sessionUser; //
  const rId = req.restaurant.id;

  const review = await Review.create({
    comment,
    rating,
    userId: uId,
    restaurantId: rId,
  }); //     userId

  return res.status(201).json({
    status: 'success',
    message: 'Review created successfully',
    review,
  });
});

exports.findOneReviews = catchAsync(async (req, res, next) => {
  const { comment, rating } = req;

  return res.status(200).json({
    status: 'success',
    comment,
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const { review } = req;
  const { comment, rating } = req.body;

  //await comment.update({ comment, rating });
  await review.update({ comment, rating });
  /*
  const review = await Review.update({
    comment,
    rating,
  });
*/
  return res.status(200).json({
    status: 'success',
    message: 'Review updated successfully',
    review,
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { review } = req;

  //await comment.update({ status: false });

  await review.update({
    status: false,
  });

  return res.status(200).json({
    status: 'success',
    message: 'Review deleted successfully',
    review,
  });
});
