'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'records', // table name
        'error_message', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'records',
        'convert_attempts',
        {
          type: Sequelize.INTEGER(11),
          allowNull: true,
        },
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('records', 'error_message'),
      queryInterface.removeColumn('records', 'convert_attempts')
    ]);
  }
};
