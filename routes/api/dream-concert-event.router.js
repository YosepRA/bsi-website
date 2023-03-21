const express = require('express');

const controller = require('../../controllers/api/dream-concert-event.controller.js');

const router = express.Router();

/* ======================= Routes ======================= */

router.get('/orders', controller.getOrders);

router.get('/orders/:id', controller.getOrder);

router.post('/orders', controller.createOrder);

module.exports = router;
