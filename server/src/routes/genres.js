const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/genreController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authenticate, isAdmin, create);
router.put('/:id', authenticate, isAdmin, update);
router.delete('/:id', authenticate, isAdmin, remove);

module.exports = router;
