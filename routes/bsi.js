const express = require('express');

const controller = require('../controllers/bsi.js');

const router = express.Router();

/* ======================= Routes ======================= */

router.get('/price', controller.price);

module.exports = router;
