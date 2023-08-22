const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Review = db.define('reviewsM', {
  //Review    // reviews

  //L
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  comment: {
    //comment   L
    type: DataTypes.TEXT, //  STRING
    allowNull: false,
  },
  /**/
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  userId: {
    // L
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    //rating     postId
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    //L
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = Review;
