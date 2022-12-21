import { ready } from './helpers.js';
import { updatePriceData, fetchPriceOnInterval } from './live-price.js';

async function globalInit() {
  await updatePriceData();

  fetchPriceOnInterval(30000);
}

ready(globalInit);
