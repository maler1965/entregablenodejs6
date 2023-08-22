const { DataTypes } = require('sequelize');
const { db } = require('./../database/config');

const User = db.define('usersM', {
  id: {
    //L
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    //L
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    //L
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  /*
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  */
  password: {
    //L
    type: DataTypes.STRING,
    allowNull: false,
  },
  passwordChangedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'password_changed_at',
  },
  /*
  profileImgUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:
      'https://images.pexels.com/photos/935762/pexels-photo-935762.jpeg',
    field: 'profile_img_url',
  },
  */
  role: {
    //L
    type: DataTypes.ENUM('normal', 'admin'),
    allowNull: false,
    defaultValue: 'normal',
  },
  /*
   status: {
    //L
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  */
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
  },
});

module.exports = User;
