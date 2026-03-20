const { Genre } = require('../models');

const getAll = async (req, res) => {
  try {
    const genres = await Genre.findAll({ order: [['name', 'ASC']] });
    res.status(200).json(genres);
  } catch (error) {
    console.error('GetAll genres error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getById = async (req, res) => {
  try {
    const genre = await Genre.findByPk(req.params.id);

    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    res.status(200).json(genre);
  } catch (error) {
    console.error('GetById genre error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const genre = await Genre.create({ name, slug });

    res.status(201).json(genre);
  } catch (error) {
    console.error('Create genre error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const genre = await Genre.findByPk(req.params.id);

    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    const { name } = req.body;
    const updateData = { ...req.body };

    if (name) {
      updateData.slug = name.toLowerCase().replace(/\s+/g, '-');
    }

    await genre.update(updateData);

    res.status(200).json(genre);
  } catch (error) {
    console.error('Update genre error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    const genre = await Genre.findByPk(req.params.id);

    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    await genre.destroy();

    res.status(200).json({ message: 'Genre deleted' });
  } catch (error) {
    console.error('Remove genre error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAll, getById, create, update, remove };
