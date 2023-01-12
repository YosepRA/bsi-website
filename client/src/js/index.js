import { ready } from './helpers.js';
import ScrollControl from './scroll-control.js';
import { navbarScroll, floatingButtonScroll } from './scroll-behaviors.js';
import {
  fetchLatestPrice,
  updatePriceData,
  fetchPriceOnInterval,
} from './live-price.js';
// import startSocket from './socket.js';

const navbar = document.querySelector('.navbar');
const floatingButton = document.querySelector('.fb');

async function start() {
  // Scroll feature.
  const scroll = new ScrollControl([
    navbarScroll(navbar),
    floatingButtonScroll(floatingButton),
  ]);

  // Live price feature.
  const data = await fetchLatestPrice();
  const delay = 120000;

  await updatePriceData(data);

  fetchPriceOnInterval(delay);

  // Socket will be disabled on Demo server, or Cyclic.sh server.
  // startSocket();
}

ready(start);
