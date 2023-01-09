const Price = require('../database/models/price.js');

async function pricePoll(delay) {
  const query = {};
  const sortKey = '-created';

  const prevPrice = await Price.findOne(query).sort(sortKey);

  setInterval(async () => {
    const data = await Price.findOne(query).sort(sortKey);
  }, delay);
}

async function price(req, res) {
  const data = await Price.findOne({}).sort('-created');

  res.json(data);
}

module.exports = { price, pricePoll };
