const Reviews = require('./reviews.model');
const { Order } = require('./orders.model');
const { Meal } = require('./meals.model');
//const Order = require('./orders.model');
const { Restaurant } = require('./restaurants.model');
//const PostImg = require('./postImg.model');
const User = require('./user.model');

const initModel = () => {
  User.hasMany(Order);
  Order.belongsTo(User);

  Restaurant.hasMany(Reviews);
  Reviews.belongsTo(Restaurant);

  User.hasMany(Reviews);
  Reviews.belongsTo(User);

  Restaurant.hasMany(Meal);
  Meal.belongsTo(Restaurant);

  Meal.hasMany(Order);
  Order.belongsTo(Meal);

  Restaurant.hasMany(Order);
  Order.belongsTo(Restaurant);

  /*
  User.hasMany(Restaurant, { foreignKey: 'userId' });
  Restaurant.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(Order);
  Order.belongsTo(User);

  Restaurant.hasMany(Reviews);
  Reviews.belongsTo(Restaurant);

  User.hasMany(Reviews);
  Reviews.belongsTo(User);

  Restaurant.hasMany(PostImg);
  PostImg.belongsTo(Restaurant);
  */
};

/*
  User.hasMany(Order); 
  Order.belongsTo(User); 

  Restaurant.hasMany(Reviews);
  Reviews.belongsTo(Restaurant);

  User.hasMany(Reviews); 
  Reviews.belongsTo(User);

  Restaurant.hasMany(Meal);
  Meal.belongsTo(Restaurant);

  Meal.hasMany(Order);
  Order.belongsTo(Meal);
*/
module.exports = initModel;
