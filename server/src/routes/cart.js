const express = require('express');
const router = express.Router();
const { getCart, addItem, updateItem, removeItem, clearCart } = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getCart);
router.post('/items', addItem);
router.put('/items/:id', updateItem);
router.delete('/items/:id', removeItem);
router.delete('/', clearCart);

module.exports = router;
