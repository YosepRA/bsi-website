import { ready } from './helpers.js';
import ScrollControl from './scroll-control.js';
import {
  fetchLatestPrice,
  updatePriceData,
  fetchPriceOnInterval,
} from './live-price.js';
import startSocket from './socket.js';

async function start() {
  function hello(scrollState) {
    console.log('We are going:', scrollState.direction);
  }

  // function world() {
  //   console.log('world');
  // }

  // Navbar scroll.
  const scroll = new ScrollControl([hello]);

  const data = await fetchLatestPrice();
  const delay = 120000;

  await updatePriceData(data);

  fetchPriceOnInterval(delay);

  // Socket will be disabled on Demo server, or Cyclic.sh server.
  // startSocket();
}

ready(start);
