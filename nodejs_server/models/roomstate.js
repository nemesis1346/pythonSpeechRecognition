'use strict';

const Sequelize = require('sequelize');

module.exports = sequelize.define('roomstate', {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  meeting_id: {
    type: Sequelize.STRING(300),
    allowNull: true,
    unique: true
  },
  isRecording: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  language_selected: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

