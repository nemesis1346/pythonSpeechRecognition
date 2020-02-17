'use strict';

const Sequelize = require('sequelize');

module.exports = sequelize.define('Speech', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      uuid: {
        type: Sequelize.UUID(),
        allowNull: false,
        unique:true
      },
      converted: {
        type: Sequelize.BOOLEAN(),
        allowNull: false,
        defaultValue:false
      },
      userId: Sequelize.INTEGER(11),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
});

