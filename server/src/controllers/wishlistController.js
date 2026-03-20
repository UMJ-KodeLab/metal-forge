const { Wishlist, Product, Genre } = require('../models');

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Product,
        attributes: ['id', 'title', 'artist', 'price', 'coverImage', 'stock'],
        include: [{
          model: Genre,
          as: 'genres',
          attributes: ['id', 'name', 'slug'],
          through: { attributes: [] },
        }],
      }],
    });

    res.status(200).json(wishlist);
  } catch (error) {
    console.error('GetWishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addItem = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existing = await Wishlist.findOne({
      where: { userId: req.user.id, productId },
    });

    if (existing) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    const item = await Wishlist.create({
      userId: req.user.id,
      productId,
    });

    const wishlistItem = await Wishlist.findByPk(item.id, {
      include: [{
        model: Product,
        attributes: ['id', 'title', 'artist', 'price', 'coverImage', 'stock'],
      }],
    });

    res.status(201).json(wishlistItem);
  } catch (error) {
    console.error('AddItem wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeItem = async (req, res) => {
  try {
    const item = await Wishlist.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!item) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    await item.destroy();

    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('RemoveItem wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getWishlist, addItem, removeItem };
