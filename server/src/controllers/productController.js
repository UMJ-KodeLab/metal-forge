const { Op } = require('sequelize');
const { Product, Genre } = require('../models');

const getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      genre,
      artist,
      search,
      minPrice,
      maxPrice,
      orderBy = 'created_at',
      order = 'DESC',
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (artist) {
      where.artist = { [Op.like]: `%${artist}%` };
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { artist: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const includeGenre = {
      model: Genre,
      as: 'genres',
      attributes: ['id', 'name', 'slug'],
      through: { attributes: [] },
    };

    if (genre) {
      includeGenre.where = { slug: genre };
    }

    const allowedOrder = ['price', 'title', 'created_at'];
    const sortField = allowedOrder.includes(orderBy) ? orderBy : 'created_at';
    const sortDirection = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [includeGenre],
      order: [[sortField, sortDirection]],
      limit: parseInt(limit),
      offset,
      distinct: true,
    });

    res.status(200).json({
      products: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    console.error('GetAll products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: Genre,
        as: 'genres',
        attributes: ['id', 'name', 'slug'],
        through: { attributes: [] },
      }],
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('GetById product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const create = async (req, res) => {
  try {
    const { genreIds, tracklist, ...productData } = req.body;

    if (req.file) {
      productData.coverImage = `/uploads/${req.file.filename}`;
    }
    if (tracklist && typeof tracklist === 'string') {
      productData.tracklist = tracklist.split('\n').filter(t => t.trim());
    } else if (tracklist) {
      productData.tracklist = tracklist;
    }

    const product = await Product.create(productData);

    if (genreIds && genreIds.length > 0) {
      await product.setGenres(genreIds);
    }

    const result = await Product.findByPk(product.id, {
      include: [{
        model: Genre,
        as: 'genres',
        attributes: ['id', 'name', 'slug'],
        through: { attributes: [] },
      }],
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { genreIds, tracklist, ...productData } = req.body;

    if (req.file) {
      productData.coverImage = `/uploads/${req.file.filename}`;
    }
    if (tracklist && typeof tracklist === 'string') {
      productData.tracklist = tracklist.split('\n').filter(t => t.trim());
    } else if (tracklist) {
      productData.tracklist = tracklist;
    }

    await product.update(productData);

    if (genreIds !== undefined) {
      await product.setGenres(genreIds);
    }

    const result = await Product.findByPk(product.id, {
      include: [{
        model: Genre,
        as: 'genres',
        attributes: ['id', 'name', 'slug'],
        through: { attributes: [] },
      }],
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();

    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Remove product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAll, getById, create, update, remove };
