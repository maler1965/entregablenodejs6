const Reviews = require('./reviews.model');
const { Order } = require('./orders.model');
const { Meal } = require('./meals.model');
const { Restaurant } = require('./restaurants.model');
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
};

module.exports = initModel;
