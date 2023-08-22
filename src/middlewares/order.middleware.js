const catchAsync = require('../utils/catchAsync');
const { Order, postStatus } = require('../models/orders.model');
const AppError = require('../utils/appError');
const User = require('../models/user.model');
const PostImg = require('../models/postImg.model');
const Comment = require('../models/reviews.model');

//L
exports.validOrder = catchAsync(async (req, res, next) => {
  //1. traer info de la req.params
  const { id } = req.params;

  //2. busco el post
  const order = await Order.findOne({
    where: {
      status: 'active', //true
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
  if (!order) {
    return next(new AppError(`Order with id: ${id} not found`, 404));
  }
  //4. adjunto el post por la req. y doy continuidad
  // req.user = restaurant.user;
  req.order = order;
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
