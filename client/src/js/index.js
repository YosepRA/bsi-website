import { ready } from './helpers.js';
import { fetchLatestPrice, updatePriceData } from './live-price.js';
import startSocket from './socket.js';

async function start() {
  const data = await fetchLatestPrice();
  await updatePriceData(data);

  startSocket();
}

ready(start);
