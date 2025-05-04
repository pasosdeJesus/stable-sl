'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('buyquote', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quoteId: {
        type: Sequelize.STRING
      },
      senderPhone: {
        type: Sequelize.STRING
      },
      senderName: {
        type: Sequelize.STRING
      },
      senderWallet: {
        type: Sequelize.STRING
      },
      timestamp: {
        type: Sequelize.INTEGER
      },
      usdPriceInSle: {
        type: Sequelize.DOUBLE
      },
      maximum: {
        type: Sequelize.DOUBLE
      },
      minimum: {
        type: Sequelize.DOUBLE
      },
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('buyquote');
  }
};
