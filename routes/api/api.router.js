const express = require('express');

const bsiRouter = require('./bsi.router.js');
const dreamConcertEventRouter = require('./dream-concert-event.router.js');

const router = express.Router();

/* ======================= Routes ======================= */

router.use('/bsi', bsiRouter);
router.use('/dream-concert-event', dreamConcertEventRouter);

module.exports = router;
