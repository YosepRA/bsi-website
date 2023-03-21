const TicketOrder = require('../../database/models/ticket-order.js');
const { promiseResolver } = require('../../utils/helpers.js');

module.exports = {
  async getOrders(req, res) {
    const {
      query: { page },
    } = req;

    const query = {};
    const pageNum = parseInt(page, 10);
    const limit = 25;
    const sort = '-timestamp';

    const [data, error] = await promiseResolver(
      TicketOrder.paginate(query, {
        page: pageNum,
        limit,
        sort,
      }),
    );

    return res.json({
      status: 'ok',
      page: data.page,
      length: data.limit,
      totalDocs: data.totalDocs,
      data: data.docs,
    });
  },
  async getOrder(req, res) {
    const {
      params: { id },
    } = req;

    const [data, error] = await promiseResolver(TicketOrder.findById(id));

    if (error) {
      return res.json({ status: 'error', data: null, message: 'Invalid ID' });
    }

    if (data === null) {
      return res.json({
        status: 'error',
        data: null,
        message: 'Data not found',
      });
    }

    return res.json({
      status: 'ok',
      data,
    });
  },
  async createOrder(req, res) {
    const { body } = req;

    const [data, error] = await promiseResolver(TicketOrder.create(body));

    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }

    return res.json({
      status: 'ok',
      data: {
        _id: data._id,
      },
    });
  },
};
