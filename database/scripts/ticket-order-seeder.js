require('dotenv').config();

const { faker } = require('@faker-js/faker');

const mongoConnect = require('./mongo-connect.js');
const TicketOrder = require('../models/ticket-order.js');

const mongoUrl = 'mongodb://127.0.0.1:27017/BSI-Website';

/* ======================= Database Connection ======================= */

const dbConnection = mongoConnect(mongoUrl);

async function generateTicketOrder(amount) {
  const ticketOrders = [];
  const status = ['active', 'finished', 'closed'];
  const unitPrice = 2.5;
  const bsiPrice = 0.5;
  const ticketAmount = faker.datatype.number({ min: 1, max: 5 });

  for (let num = 0; num < amount; num += 1) {
    const ticketOrder = {
      uid: faker.random.numeric(5),
      email: 'your_name@mail.com',
      payeeCode: '123',
      ticketAmount,
      bsiPrice,
      totalBSI: (unitPrice * ticketAmount) / bsiPrice,
      status: faker.helpers.arrayElement(status),
      statusMessage: '',
      timestamp: faker.date.recent(7, new Date()),
    };

    ticketOrders.push(ticketOrder);
  }

  try {
    await TicketOrder.create(ticketOrders);

    console.log(`Successfully generated ${amount} of ticket orders.`);
  } catch (error) {
    console.log('Seeder error:', error.message);
  }
}

async function start() {
  if (process.env.NODE_ENV !== 'development') {
    console.log('You are not in development environment.');

    process.exit();
  }

  await generateTicketOrder(10);

  dbConnection.close();
}

start();
