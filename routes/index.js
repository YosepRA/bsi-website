const express = require('express');

const controller = require('../controllers/index.js');
const { lang } = require('../middlewares/index.js');

const router = express.Router({ mergeParams: true });

/* ======================= Routes ======================= */

router.get('/home', lang, controller.index);

router.get('/bsi', lang, controller.bsi);

router.get('/service', lang, controller.service);

router.get('/about', lang, controller.about);

router.get('/contact', lang, controller.contact);

router.get('/exchange', lang, controller.exchange);

module.exports = router;
