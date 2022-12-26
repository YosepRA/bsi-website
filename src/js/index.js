import { ready } from './helpers.js';
import ScrollControl from './scroll-control.js';
import { updatePriceData, fetchPriceOnInterval } from './live-price.js';

async function globalInit() {
  function hello(scrollState) {
    console.log('We are going:', scrollState.direction);
  }

  // function world() {
  //   console.log('world');
  // }

  // Navbar scroll.
  const scroll = new ScrollControl([hello]);

  // Live price.
  await updatePriceData();
  fetchPriceOnInterval(30000);
}

ready(globalInit);
