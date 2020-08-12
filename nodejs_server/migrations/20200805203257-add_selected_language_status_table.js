'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'roomstates', // table name
        'language_selected', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('roomstates', 'language_selected'),
    ]);
  }
};
