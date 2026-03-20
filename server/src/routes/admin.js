const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/adminController');
const { getAllAdmin } = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.use(authenticate, isAdmin);

router.get('/dashboard', getDashboard);
router.get('/orders', getAllAdmin);

module.exports = router;
