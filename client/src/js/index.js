import { ready } from './helpers.js';
import ScrollControl from './scroll-control.js';
import { navbarScroll, floatingButtonScroll } from './scroll-behaviors.js';
import {
  fetchLatestPrice,
  updatePriceData,
  fetchPriceOnInterval,
} from './live-price.js';
// import startSocket from './socket.js';
import DreamConcertPosterDialog from './dialogs/dream-concert-poster-dialog.js';

const navbar = document.querySelector('.navbar');
const floatingButton = document.querySelector('.fb');

async function start() {
  // Scroll feature.
  // const scroll = new ScrollControl([
  //   navbarScroll(navbar),
  //   floatingButtonScroll(floatingButton),
  // ]);

  // Live price feature.
  // const data = await fetchLatestPrice();
  // const delay = 120000;
  // await updatePriceData(data);
  // fetchPriceOnInterval(delay);

  // Socket will be disabled on Demo server, or Cyclic.sh server.
  // startSocket();

  // Dream Concert poster popup.
  // Only show in home page.
  const homePathPattern = /^\/\w{2}\/home$/;

  if (window.location.pathname.match(homePathPattern)) {
    const dreamConcertPosterDialog = new DreamConcertPosterDialog(
      'dialog--dream-concert-poster',
    );

    dreamConcertPosterDialog.showPosterDialog();
  }
}

ready(start);
