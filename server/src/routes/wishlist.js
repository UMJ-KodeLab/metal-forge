const express = require('express');
const router = express.Router();
const { getWishlist, addItem, removeItem } = require('../controllers/wishlistController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getWishlist);
router.post('/', addItem);
router.delete('/:productId', removeItem);

module.exports = router;
