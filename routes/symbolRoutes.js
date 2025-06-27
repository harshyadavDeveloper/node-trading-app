const express = require('express');
const symbolController = require('../controllers/symbolController');

const router = express.Router();

router.route('/').get(symbolController.getSymbols);

module.exports = router;