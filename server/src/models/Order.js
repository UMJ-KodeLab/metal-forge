const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
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
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'pending',
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentId: {
      type: DataTypes.STRING(255),
      field: 'payment_id',
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      field: 'shipping_address',
    },
  }, {
    tableName: 'orders',
    underscored: true,
  });

  return Order;
};
