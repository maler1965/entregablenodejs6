const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

//console.log('Pedro, model');

const Restaurant = db.define('restaurantsN', {
  id: {
    //L
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  /**/
  name: {
    //L
    type: DataTypes.STRING,
    allowNull: false,
  },

  address: {
    //L
    type: DataTypes.STRING,
    allowNull: false,
  },

  /*
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },

  //-----------

  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },


  */

  rating: {
    //L
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  /*
  status: {
    //L
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },

  //==========
  */
  status: {
    type: DataTypes.ENUM('active', 'disabled'),
    allowNull: false,
    defaultValue: 'active',
  },
});

//----------------------
const postStatus = Object.freeze({
  active: 'active',
  disabled: 'disabled',
});

module.exports = { Restaurant, postStatus };
