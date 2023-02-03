const Price = require('../database/models/price.js');
// const socket = require('../socket/index.js');

async function pricePoll(io, delay) {
  const query = {};
  const sortKey = '-created';

  let prevPrice = await Price.findOne(query).sort(sortKey);

  setInterval(async () => {
    const nextPrice = await Price.findOne(query).sort(sortKey);

    // If it's not the latest, don't do anything.
    if (!(prevPrice.lastUpdatedAt < nextPrice.lastUpdatedAt)) return undefined;

    io.emit('price', nextPrice);
    prevPrice = nextPrice;

    return undefined;
  }, delay);
}

async function price(req, res) {
  const data = await Price.findOne({}).sort('-created');

  res.json(data);
}

module.exports = { price, pricePoll };
