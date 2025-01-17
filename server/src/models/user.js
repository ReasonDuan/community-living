const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  openid: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User; 