const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema, model } = mongoose;

const ticketOrderSchema = new Schema({
  uid: String,
  email: String,
  payeeCode: String,
  ticketAmount: Number,
  bsiPrice: Number,
  totalBSI: Number,
  status: { type: String, enum: ['active', 'finished', 'closed'] },
  statusMessage: String,
  timestamp: { type: Date, default: Date.now },
});

ticketOrderSchema.plugin(mongoosePaginate);

const Model = model('TicketOrder', ticketOrderSchema);

module.exports = Model;
