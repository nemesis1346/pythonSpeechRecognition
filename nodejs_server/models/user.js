'use strict';
module.exports = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  usename: {
    type: Sequelize.STRING(300),
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING(300),
    allowNull: false
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
}, {});