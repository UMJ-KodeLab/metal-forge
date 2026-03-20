const express = require('express');
const router = express.Router();
const { create, getAll, getById, updateStatus, getAllAdmin } = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.use(authenticate);

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id/status', isAdmin, updateStatus);

module.exports = router;
