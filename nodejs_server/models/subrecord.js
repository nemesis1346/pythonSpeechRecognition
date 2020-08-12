'use strict';
const Sequelize = require('sequelize');
module.exports = sequelize.define('subrecord', {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  uuid: {
    type: Sequelize.STRING(300),
    allowNull: false,
    unique: true
  },
  startTime: {
    type: Sequelize.STRING(300)
  },
  endTime: {
    type: Sequelize.STRING(300)
  },
  duration: {
    type: Sequelize.STRING(300)
  },
  transcription: {
    type: Sequelize.STRING(300)
  },
  record_id: {
    type: Sequelize.STRING(300)
  },
  converted: {
    type: Sequelize.BOOLEAN(),
    allowNull: false,
    defaultValue: false
  },
  meeting_id: {
    type: Sequelize.STRING(300),
    allowNull: true,
  },
  order:{
    type:Sequelize.INTEGER(11),
  },
  transcription: Sequelize.TEXT(),
  userId: Sequelize.INTEGER(11),
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});
