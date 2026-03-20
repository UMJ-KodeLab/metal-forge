const { Cart, CartItem, Product } = require('../models');

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          attributes: ['id', 'title', 'artist', 'price', 'coverImage', 'stock'],
        }],
      }],
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
      cart = await Cart.findOne({
        where: { id: cart.id },
        include: [{
          model: CartItem,
          as: 'items',
          include: [{
            model: Product,
            attributes: ['id', 'title', 'artist', 'price', 'coverImage', 'stock'],
          }],
        }],
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error('GetCart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addItem = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }

    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (cartItem) {
      cartItem.quantity += parseInt(quantity);
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity: parseInt(quantity),
      });
    }

    const updatedCart = await Cart.findOne({
      where: { id: cart.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          attributes: ['id', 'title', 'artist', 'price', 'coverImage', 'stock'],
        }],
      }],
    });

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('AddItem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = await CartItem.findOne({
      where: { id: req.params.itemId, cartId: cart.id },
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    cartItem.quantity = parseInt(quantity);
    await cartItem.save();

    const updatedCart = await Cart.findOne({
      where: { id: cart.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          attributes: ['id', 'title', 'artist', 'price', 'coverImage', 'stock'],
        }],
      }],
    });

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('UpdateItem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = await CartItem.findOne({
      where: { id: req.params.itemId, cartId: cart.id },
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.destroy();

    const updatedCart = await Cart.findOne({
      where: { id: cart.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          attributes: ['id', 'title', 'artist', 'price', 'coverImage', 'stock'],
        }],
      }],
    });

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('RemoveItem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });

    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('ClearCart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
