const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductGenre = sequelize.define('ProductGenre', {
    productId: {
      type: DataTypes.INTEGER,
      field: 'product_id',
      references: { model: 'products', key: 'id' },
    },
    genreId: {
      type: DataTypes.INTEGER,
      field: 'genre_id',
      references: { model: 'genres', key: 'id' },
    },
  }, {
    tableName: 'product_genres',
    underscored: true,
    timestamps: false,
  });

  return ProductGenre;
};
