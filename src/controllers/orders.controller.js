const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const { Order } = require('../models/orders.model');
const User = require('../models/user.model');
const { Meal } = require('../models/meals.model');

exports.findAllOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const id = sessionUser.id;

  const orders = await Order.findAll({
    where: {
      status: 'active',
      userId: id,
    },
    attributes: {
      exclude: ['status'],
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: ['status', 'password'],
        },
      },
    ],
    order: [['createdAt', 'DESC']],
    limit: 10,
  });

  return res.status(200).json({
    status: 'success',
    results: orders.length,
    orders,
  });
});

exports.findMyOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const uid = sessionUser.id;

  const orders = await Order.findAll({
    where: {
      status: 'active',
      userId: uid,
    },
  });

  return res.status(200).json({
    status: 'success',
    results: orders.length,
    orders,
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const { quantity, mealId } = req.body;
  const { id: userId } = req.sessionUser;

  const meal = await Meal.findOne({
    where: {
      id: mealId,
      status: true,
    },
  });

  if (!meal) {
    return next(new AppError(`Meal with id: ${mealId} not found`, 404));
  }

  const price = meal.price;
  const totalPrice = price * quantity;

  const order = await Order.create({ quantity, mealId, userId, totalPrice });

  return res.status(201).json({
    status: 'success',
    message: 'the order has been created!',
    order,
    meal,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'completed' });

  return res.status(200).json({
    status: 'success',
    message: 'the order has been updated',
    order,
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'cancelled' });

  return res.status(200).json({
    status: 'success',
    message: 'the post has been deleted!',
  });
});
