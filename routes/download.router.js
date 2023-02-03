const express = require('express');

const controller = require('../controllers/download.controller.js');

const router = express.Router();

/* ======================= Routes ======================= */

router.get('/:fileName', controller.download);

module.exports = router;
