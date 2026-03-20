'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin',
        email: 'admin@metalforge.com',
        password_hash: bcrypt.hashSync('admin123', 10),
        role: 'admin',
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@metalforge.com' });
  },
};
