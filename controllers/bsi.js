const Price = require('../database/models/price.js');

module.exports = {
  async price(req, res) {
    const data = await Price.findOne({}).sort('-created');

    res.json(data);
  },
};
