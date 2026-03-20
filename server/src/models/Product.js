const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    artist: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    coverImage: {
      type: DataTypes.STRING(500),
      field: 'cover_image',
    },
    releaseYear: {
      type: DataTypes.INTEGER,
      field: 'release_year',
    },
    label: {
      type: DataTypes.STRING(255),
    },
    tracklist: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  }, {
    tableName: 'products',
    underscored: true,
  });

  return Product;
};
