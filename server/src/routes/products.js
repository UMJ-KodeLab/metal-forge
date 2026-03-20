const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/productController');
const { authenticate, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authenticate, isAdmin, upload.single('coverImage'), create);
router.put('/:id', authenticate, isAdmin, upload.single('coverImage'), update);
router.delete('/:id', authenticate, isAdmin, remove);

module.exports = router;
