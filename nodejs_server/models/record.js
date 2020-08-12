'use strict';

const Sequelize = require('sequelize');

module.exports = sequelize.define('record', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      uuid: {
        type: Sequelize.STRING(300),
        allowNull: false,
        unique:true
      },
      converted: {
        type: Sequelize.BOOLEAN(),
        allowNull: false,
        defaultValue:false
      },
      meeting_id: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      duration: {
        type: Sequelize.STRING(300)
      },
      startTime: {
        type: Sequelize.STRING(300)
      },
      endTime: {
        type: Sequelize.STRING(300)
      },
      transcription:Sequelize.TEXT(),
      userId: Sequelize.INTEGER(11),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      
});

