import { ready } from './helpers.js';
import {
  fetchLatestPrice,
  updatePriceData,
  fetchPriceOnInterval,
} from './live-price.js';
import startSocket from './socket.js';

async function start() {
  const data = await fetchLatestPrice();
  const delay = 120000;

  await updatePriceData(data);

  fetchPriceOnInterval(delay);

  // Socket will be disabled on Demo server, or Cyclic.sh server.
  // startSocket();
}

ready(start);
