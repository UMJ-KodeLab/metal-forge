'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_genres', {
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      genre_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'genres',
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_genres');
  },
};
