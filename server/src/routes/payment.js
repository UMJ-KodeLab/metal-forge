const express = require('express');
const router = express.Router();
const { createPreference, webhook } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

router.post('/create-preference', authenticate, createPreference);
router.post('/webhook', webhook);

module.exports = router;
