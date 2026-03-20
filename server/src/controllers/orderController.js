const { Order, OrderItem, Cart, CartItem, Product, User } = require('../models');

const create = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{ model: Product }],
      }],
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let total = 0;
    for (const item of cart.items) {
      total += parseFloat(item.Product.price) * item.quantity;
    }

    const order = await Order.create({
      userId: req.user.id,
      status: 'pending',
      total,
      shippingAddress,
    });

    const orderItems = cart.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.Product.price,
    }));

    await OrderItem.bulkCreate(orderItems);

    await CartItem.destroy({ where: { cartId: cart.id } });

    const result = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          attributes: ['id', 'title', 'artist', 'price', 'coverImage'],
        }],
      }],
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAll = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          attributes: ['id', 'title', 'artist', 'price', 'coverImage'],
        }],
      }],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('GetAll orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          attributes: ['id', 'title', 'artist', 'price', 'coverImage'],
        }],
      }],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('GetById order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status });

    res.status(200).json(order);
  } catch (error) {
    console.error('UpdateStatus order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    const orders = await Order.findAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            attributes: ['id', 'title', 'artist', 'price', 'coverImage'],
          }],
        },
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('GetAllAdmin orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { create, getAll, getById, updateStatus, getAllAdmin };
