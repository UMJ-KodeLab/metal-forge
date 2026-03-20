const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Wishlist = sequelize.define('Wishlist', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id',
    },
  }, {
    tableName: 'wishlists',
    underscored: true,
  });

  return Wishlist;
};
