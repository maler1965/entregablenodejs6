const catchAsync = require('../utils/catchAsync');
const { Restaurant, postStatus } = require('../models/restaurants.model');
//const { Op } = require('sequelize');

exports.findAllRestaurant = catchAsync(async (req, res, next) => {
  // const { initDate, endDate } = req.query;

  const comments = await Restaurant.findAll({
    where: {
      status: postStatus.active, //true,
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

exports.findUserRestaurant = catchAsync(async (req, res, next) => {
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

exports.findMyRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;

  const posts = await Post.findAll({
    where: {
      status: postStatus.active, //postStatus.disabled
      userId: id,
    },
    include: [
      {
        model: PostImg,
      },
    ],
  });

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

  return res.status(200).json({
    status: 'success',
    results: posts.length,
    posts,
  });
});

//name, address, rating (INT)
exports.createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  //console.log({ name });
  //const  uId =  req.sessionUser.id; //{ id: userId } = req.sessionUser; //

  const restaurant = await Restaurant.create({ name, address, rating }); //userId: uId

  //console.log({ restaurant });

  return res.status(201).json({
    status: 'success',
    message: 'Restaurant created successfully',
    restaurant,
  });
});

exports.findOneRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  return res.status(200).json({
    status: 'success',
    restaurant,
  });
});

exports.updateRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, address } = req.body;

  await restaurant.update({ name, address });

  return res.status(200).json({
    status: 'success',
    message: 'Restaurant updated successfully',
  });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: postStatus.disabled });

  return res.status(200).json({
    status: 'success',
    message: 'Restaurant deleted successfully',
  });
});
