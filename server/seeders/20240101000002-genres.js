'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const genreNames = [
      'Thrash Metal',
      'Death Metal',
      'Black Metal',
      'Power Metal',
      'Doom Metal',
      'Speed Metal',
      'Heavy Metal',
      'Metalcore',
      'Symphonic Metal',
      'Progressive Metal',
      'Folk Metal',
      'Nu Metal',
    ];

    const genres = genreNames.map((name) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert('genres', genres);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('genres', null, {});
  },
};
