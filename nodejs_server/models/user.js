'use strict';
const Sequelize = require('sequelize');

module.exports = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING(300),
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING(300),
    allowNull: false
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  
}, {});