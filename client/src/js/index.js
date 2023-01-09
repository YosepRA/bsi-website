import { ready } from './helpers.js';
import {
  fetchLatestPrice,
  updatePriceData,
  fetchPriceOnInterval,
} from './live-price.js';
import socket from './socket.js';

async function start() {
  const data = await fetchLatestPrice();
  await updatePriceData(data);

  fetchPriceOnInterval(30000);
}

ready(start);
