const express = require('express');

const controller = require('../../controllers/api/bsi.controller.js');

const router = express.Router();

/* ======================= Routes ======================= */

router.get('/price', controller.price);

module.exports = router;
