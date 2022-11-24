const express = require('express');

const controller = require('../controllers/index.js');

const router = express.Router();

/* ======================= Routes ======================= */

router.get('/', controller.index);

router.get('/bsi', controller.bsi);

router.get('/service', controller.service);

router.get('/about', controller.about);

router.get('/contact', controller.contact);

router.get('/exchange', controller.exchange);

module.exports = router;
