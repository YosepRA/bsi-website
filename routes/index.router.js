const express = require('express');

const controller = require('../controllers/index.controller.js');
const { lang } = require('../middlewares/index.js');

const router = express.Router({ mergeParams: true });

/* ======================= Routes ======================= */

router.get('/home', lang, controller.index);

router.get('/bsi', lang, controller.bsi);

router.get('/service', lang, controller.service);

router.get('/about', lang, controller.about);

router.get('/contact', lang, controller.contact);

router.get('/exchange', lang, controller.exchange);

router.get('/dream-concert-event', lang, controller.dreamConcertEvent);

router.get('/dream-concert', lang, controller.dreamConcert);

module.exports = router;
