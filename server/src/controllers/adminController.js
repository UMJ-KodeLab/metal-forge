const { Op } = require('sequelize');
const { Product, Order, OrderItem, User, sequelize } = require('../models');

const getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.count();

    const totalOrders = await Order.count();

    const revenueResult = await Order.sum('total', {
      where: { status: 'paid' },
    });
    const totalRevenue = revenueResult || 0;

    const lowStockProducts = await Product.findAll({
      where: { stock: { [Op.lt]: 5 } },
      order: [['stock', 'ASC']],
    });

    const recentOrders = await Order.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'email'],
      }],
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    res.status(200).json({
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockProducts,
      recentOrders,
    });
  } catch (error) {
    console.error('GetDashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboard };
