'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('subrecords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11)
      },
      uuid: {
        type: Sequelize.STRING(300),
        allowNull:false,
        unique:true
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
      meeting_id: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      record_id: {
        type: Sequelize.STRING(300)
      },
      converted: {
        type: Sequelize.BOOLEAN(),
        allowNull: false,
        defaultValue:false
      },
      order:{
        type:Sequelize.INTEGER(11),
      },
      transcription:Sequelize.TEXT(),
      userId: Sequelize.INTEGER(11),
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('subrecords');
  }
};