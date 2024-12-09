'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Loans', 'fine', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('Loans', 'status', {
      type: Sequelize.ENUM('active', 'returned'),
      allowNull: false,
      defaultValue: 'active',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Loans', 'fine');
    await queryInterface.removeColumn('Loans', 'status');
  },
};
