const catchAsync = require('../utils/catchAsync');
const { Restaurant, postStatus } = require('../models/restaurants.model');
const AppError = require('../utils/appError');
const User = require('../models/user.model');
const PostImg = require('../models/postImg.model');
const Review = require('../models/reviews.model');

//L
exports.validReview = catchAsync(async (req, res, next) => {
  //1. traer info de la req.params
  const { id } = req.params;

  //2. busco el post
  const review = await Review.findOne({
    where: {
      status: true, //true
      id,
    },

    /*
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'profileImgUrl', 'description'],
      },
    ],
*/
  });
  //3. valido que el post exista
  if (!review) {
    return next(new AppError(`Post with id: ${id} not found`, 404));
  }
  //4. adjunto el post por la req. y doy continuidad
  // req.user = restaurant.user;
  req.review = review;
  next();
});

exports.validPostPerFindOne = catchAsync(async (req, res, next) => {
  //1. traer info de la req.params
  const { id } = req.params;

  //2. busco el post
  const post = await Post.findOne({
    where: {
      status: postStatus.active,
      id,
    },
    /*
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'profileImgUrl', 'description'],
      },
      {
        model: PostImg,
      },
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'profileImgUrl', 'description'],
          },
        ],
      },
    ],
*/
  });
  //3. valido que el post exista
  if (!post) {
    return next(new AppError(`Post with id: ${id} not found`, 404));
  }
  //4. adjunto el post por la req. y doy continuidad
  req.user = post.user;
  req.post = post;
  next();
});
