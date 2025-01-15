const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Merchant = sequelize.define('Merchant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_open: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  open_time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  close_time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('open', 'close', 'long_term_close'),
    defaultValue: 'open'
  }
}, {
  tableName: 'merchants',
  timestamps: true
});

module.exports = Merchant; 