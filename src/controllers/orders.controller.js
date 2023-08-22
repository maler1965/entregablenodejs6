const catchAsync = require('../utils/catchAsync');
//const crypto = require('node:crypto');

const { db } = require('../database/config');

const { Order } = require('../models/orders.model');
const User = require('../models/user.model');
//const Comment = require('../models/reviews.model');
const { Restaurant } = require('../models/restaurants.model');
const { Meal } = require('../models/meals.model');

//const storage = require('../utils/firebase');
//const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

exports.findAllOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const id = sessionUser.id;
  console.log({ id });
  /*
  const users = await User.findAll({
    where: {
      status: 'active',
      userId: sessionUser.id,
    },
  });
  */
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
        //attributes: ['id', 'name'],
      },
      /*
      {
        model: PostImg,
      },
      */
    ],
    order: [['createdAt', 'DESC']],
    limit: 10,
  });

  console.log('Pedro hola');
  console.log({ orders });
  /*
  const postPromises = orders.map(async (post) => {
    const imgRefUser = ref(storage, post.user.profileImgUrl);
    const urlUser = await getDownloadURL(imgRefUser);

    post.user.profileImgUrl = urlUser;

    const postImgsPromises = post.PostImgs.map(async (postImg) => {
      const imgRef = ref(storage, postImg.postImgUrl);
      const url = await getDownloadURL(imgRef);

      postImg.postImgUrl = url;
      return postImg;
    });

    const postImgsResolved = await Promise.all(postImgsPromises);
    post.PostImgs = postImgsResolved;

    return post;
  });

  await Promise.all(postPromises);

  */

  return res.status(200).json({
    status: 'success',
    results: orders.length,
    orders,
  });
});

exports.findMyOrders = catchAsync(async (req, res, next) => {
  // const { id } = req.params;
  //const { uid } = req.sessionUser;

  const { sessionUser } = req;
  const uid = sessionUser.id;

  console.log({ uid });

  const order = await Order.findAll({
    where: {
      //  id,
      status: 'active',
      userId: uid,
    },
    include: [
      {
        model: Meal,
      },
      {
        model: Restaurant,
      },
    ],
  });

  //console.log('Pedro hola');
  //console.log({ order });
  /*
  if (posts.length > 0) {
    const postPromises = posts.map(async (post) => {
      const postImgsPromises = post.PostImgs.map(async (postImg) => {
        const imgRef = ref(storage, postImg.postImgUrl);
        const url = await getDownloadURL(imgRef);

        postImg.postImgUrl = url;
        return postImg;
      });

      const postImgsResolved = await Promise.all(postImgsPromises);
      post.PostImgs = postImgsResolved;

      return post;
    });

    await Promise.all(postPromises);
  }
*/

  return res.status(200).json({
    status: 'success',
    //results: posts.length,
    order,
  });
});

exports.findUserPosts = catchAsync(async (req, res, next) => {
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
    posts: rows,
  });
});
//quantity y mealId
exports.createOrder = catchAsync(async (req, res, next) => {
  const { quantity, mealId } = req.body;
  const { id: userId } = req.sessionUser;

  const meal = await Meal.findOne({
    where: {
      id: mealId,
      status: true,
      //userId: uid,
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
  });
});

exports.findOnePost = catchAsync(async (req, res, next) => {
  const { post } = req;
  let postImgsPromises = [];
  let userImgsCommentPromises = [];

  const imgRefUserProfile = ref(storage, post.user.profileImgUrl);
  const urlUserProfile = await getDownloadURL(imgRefUserProfile);

  post.user.profileImgUrl = urlUserProfile;

  if (post.PostImgs?.length > 0) {
    postImgsPromises = post.PostImgs.map(async (postImg) => {
      const imgRef = ref(storage, postImg.postImgUrl);
      const url = await getDownloadURL(imgRef);

      postImg.postImgUrl = url;
      return postImg;
    });
  }

  if (post.comments?.length > 0) {
    userImgsCommentPromises = post.comments.map(async (comment) => {
      const imgRef = ref(storage, comment.user.profileImgUrl);
      const url = await getDownloadURL(imgRef);

      comment.user.profileImgUrl = url;
      return comment;
    });
  }

  const arrPromises = [...postImgsPromises, ...userImgsCommentPromises];

  await Promise.all(arrPromises);

  return res.status(200).json({
    status: 'sucess',
    post,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { order } = req;
  //const { title, content } = req.body;

  await order.update({ status: 'completed' });

  return res.status(200).json({
    status: 'success',
    message: 'the post has been updated',
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
