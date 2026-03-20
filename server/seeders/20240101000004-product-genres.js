'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Genre IDs based on insertion order in genres seeder:
    // 1: Thrash Metal
    // 2: Death Metal
    // 3: Black Metal
    // 4: Power Metal
    // 5: Doom Metal
    // 6: Speed Metal
    // 7: Heavy Metal
    // 8: Metalcore
    // 9: Symphonic Metal
    // 10: Progressive Metal
    // 11: Folk Metal
    // 12: Nu Metal

    const productGenres = [
      // Existing products (1-12)
      { product_id: 1, genre_id: 1 },   // Metallica - Master of Puppets -> Thrash Metal
      { product_id: 2, genre_id: 7 },   // Iron Maiden - The Number of the Beast -> Heavy Metal
      { product_id: 3, genre_id: 7 },   // Black Sabbath - Paranoid -> Heavy Metal
      { product_id: 4, genre_id: 1 },   // Slayer - Reign in Blood -> Thrash Metal
      { product_id: 5, genre_id: 1 },   // Megadeth - Rust in Peace -> Thrash Metal
      { product_id: 6, genre_id: 7 },   // Judas Priest - Painkiller -> Heavy Metal
      { product_id: 7, genre_id: 1 },   // Pantera - Vulgar Display of Power -> Thrash Metal
      { product_id: 8, genre_id: 2 },   // Death - Symbolic -> Death Metal
      { product_id: 9, genre_id: 10 },  // Opeth - Blackwater Park -> Progressive Metal
      { product_id: 10, genre_id: 9 },  // Nightwish - Once -> Symphonic Metal
      { product_id: 11, genre_id: 4 },  // Blind Guardian - Nightfall in Middle-Earth -> Power Metal
      { product_id: 12, genre_id: 5 },  // Candlemass - Epicus Doomicus Metallicus -> Doom Metal

      // New products (13-62)
      // Thrash Metal
      { product_id: 13, genre_id: 1 },  // Anthrax - Among the Living
      { product_id: 14, genre_id: 1 },  // Exodus - Bonded by Blood

      // Death Metal
      { product_id: 15, genre_id: 2 },  // Cannibal Corpse - Tomb of the Mutilated
      { product_id: 16, genre_id: 2 },  // Morbid Angel - Altars of Madness
      { product_id: 17, genre_id: 2 },  // Obituary - Cause of Death
      { product_id: 18, genre_id: 2 },  // Deicide - Legion

      // Black Metal
      { product_id: 19, genre_id: 3 },  // Mayhem - De Mysteriis Dom Sathanas
      { product_id: 20, genre_id: 3 },  // Burzum - Filosofem
      { product_id: 21, genre_id: 3 },  // Darkthrone - A Blaze in the Northern Sky
      { product_id: 22, genre_id: 3 },  // Emperor - In the Nightside Eclipse
      { product_id: 23, genre_id: 3 },  // Immortal - At the Heart of Winter

      // Power Metal
      { product_id: 24, genre_id: 4 },  // Helloween - Keeper of the Seven Keys Part II
      { product_id: 25, genre_id: 4 },  // Stratovarius - Visions
      { product_id: 26, genre_id: 4 },  // Gamma Ray - Land of the Free
      { product_id: 27, genre_id: 4 },  // Rhapsody of Fire - Symphony of Enchanted Lands

      // Doom Metal
      { product_id: 28, genre_id: 5 },  // Electric Wizard - Dopethrone
      { product_id: 29, genre_id: 5 },  // My Dying Bride - Turn Loose the Swans
      { product_id: 30, genre_id: 5 },  // Paradise Lost - Gothic
      { product_id: 31, genre_id: 5 },  // Saint Vitus - Born Too Late

      // Speed Metal
      { product_id: 32, genre_id: 6 },  // Motorhead - Ace of Spades
      { product_id: 33, genre_id: 6 },  // Agent Steel - Skeptics Apocalypse
      { product_id: 34, genre_id: 6 },  // Exciter - Heavy Metal Maniac
      { product_id: 35, genre_id: 6 },  // Razor - Evil Invaders
      { product_id: 36, genre_id: 6 },  // Anvil - Metal on Metal

      // Heavy Metal
      { product_id: 37, genre_id: 7 },  // Dio - Holy Diver
      { product_id: 38, genre_id: 7 },  // Ozzy Osbourne - Blizzard of Ozz

      // Metalcore
      { product_id: 39, genre_id: 8 },  // Killswitch Engage - Alive or Just Breathing
      { product_id: 40, genre_id: 8 },  // As I Lay Dying - Shadows Are Security
      { product_id: 41, genre_id: 8 },  // Parkway Drive - Horizons
      { product_id: 42, genre_id: 8 },  // Trivium - Ascendancy
      { product_id: 43, genre_id: 8 },  // August Burns Red - Messengers

      // Symphonic Metal
      { product_id: 44, genre_id: 9 },  // Epica - The Phantom Agony
      { product_id: 45, genre_id: 9 },  // Within Temptation - The Silent Force
      { product_id: 46, genre_id: 9 },  // Therion - Vovin
      { product_id: 47, genre_id: 9 },  // Kamelot - The Black Halo

      // Progressive Metal
      { product_id: 48, genre_id: 10 }, // Dream Theater - Images and Words
      { product_id: 49, genre_id: 10 }, // Tool - Lateralus
      { product_id: 50, genre_id: 10 }, // Fates Warning - Awaken the Guardian
      { product_id: 51, genre_id: 10 }, // Queensryche - Operation: Mindcrime

      // Folk Metal
      { product_id: 52, genre_id: 11 }, // Ensiferum - Iron
      { product_id: 53, genre_id: 11 }, // Finntroll - Nattfodd
      { product_id: 54, genre_id: 11 }, // Eluveitie - Slania
      { product_id: 55, genre_id: 11 }, // Korpiklaani - Voice of Wilderness
      { product_id: 56, genre_id: 11 }, // Turisas - Battle Metal

      // Nu Metal
      { product_id: 57, genre_id: 12 }, // Korn - Korn
      { product_id: 58, genre_id: 12 }, // System of a Down - Toxicity
      { product_id: 59, genre_id: 12 }, // Deftones - White Pony
      { product_id: 60, genre_id: 12 }, // Slipknot - Iowa
      { product_id: 61, genre_id: 12 }, // Linkin Park - Hybrid Theory
    ];

    await queryInterface.bulkInsert('product_genres', productGenres);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('product_genres', null, {});
  },
};
