import Splide from '@splidejs/splide';

import Ticket from './ticket.js';
import Countdown from './countdown.js';
import { ready } from './helpers.js';

import '@splidejs/splide/css';

const uidInput = document.getElementById('uidInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const passwordInputEye = document.querySelector(
  '.banner__ticket-form__input-icon--password',
);
const payeeInput = document.getElementById('payeeInput');
const amountInput = document.getElementById('amountInput');
const amountInputPlus = document.querySelector(
  '.banner__ticket-form__form-amount__btn--plus',
);
const amountInputMinus = document.querySelector(
  '.banner__ticket-form__form-amount__btn--minus',
);
const exchangeButton = document.querySelector(
  '.banner__footer-actions-exchange',
);
const dreamConcertBuy = document.querySelector('.dream-concert__info-buy');
const checkTicketButton = document.querySelector(
  '.banner__footer-actions-check-ticket',
);
const uidInputGuide = document.querySelector('.form-label__guide-btn--uid');
const payeeInputGuide = document.querySelector('.form-label__guide-btn--payee');
const aboutBSI = document.querySelector('.about-bsi');
const aboutBSIShortBtn = document.querySelector(
  '.about-bsi__col--info-short button',
);
const aboutBSILongBtn = document.querySelector(
  '.about-bsi__col--info-long button',
);

function handleDreamConcertBuy() {
  window.scroll({ top: 0, left: 0, behavior: 'smooth' });
}

function handleAboutBSIToggle(status) {
  if (status) {
    aboutBSI.classList.add('show');
  } else {
    aboutBSI.classList.remove('show');
  }
  aboutBSI.scrollIntoView();
}

function pricePoll(interval, ticket) {
  const intervalId = setInterval(async () => {
    await ticket.getPrice();
  }, interval);

  return intervalId;
}

function start() {
  const ticket = new Ticket();

  uidInput.addEventListener('input', ticket.handleUIDChange);
  uidInput.addEventListener('focus', ticket.resetErrors);
  emailInput.addEventListener('input', ticket.handleEmailChange);
  emailInput.addEventListener('focus', ticket.resetErrors);
  passwordInput.addEventListener('input', ticket.handlePasswordChange);
  passwordInput.addEventListener('focus', ticket.resetErrors);
  passwordInputEye.addEventListener('click', ticket.handlePasswordShowToggle);
  // payeeInput.addEventListener('input', ticket.handlePayeeChange);
  amountInput.addEventListener('input', ticket.handleAmountChange);
  amountInput.addEventListener('focus', ticket.resetErrors);
  amountInputPlus.addEventListener('click', () => {
    ticket.handleAmountButton(1);
  });
  amountInputMinus.addEventListener('click', () => {
    ticket.handleAmountButton(-1);
  });
  exchangeButton.addEventListener('click', ticket.handleExchange);
  dreamConcertBuy.addEventListener('click', handleDreamConcertBuy);
  checkTicketButton.addEventListener('click', ticket.showCheckTicket);
  uidInputGuide.addEventListener('click', ticket.showUIDGuide);
  // payeeInputGuide.addEventListener('click', ticket.showPayeeCodeGuide);
  aboutBSIShortBtn.addEventListener('click', () => handleAboutBSIToggle(true));
  aboutBSILongBtn.addEventListener('click', () => handleAboutBSIToggle(false));

  // BSI price polling.
  const pollInterval = 60000;
  const pricePollInterval = pricePoll(pollInterval, ticket);

  // Countdown.
  const countDownDate = new Date('May 27, 2023 00:00:00').getTime();
  const countDown = new Countdown(countDownDate);

  countDown.startTimer();

  // Artist slider.
  const artistSlider = new Splide('.artist__slider', {
    type: 'loop',
    perPage: 3,
    speed: 800,
    gap: 10,
    breakpoints: {
      768: {
        perPage: 2,
        rewind: false,
      },
      576: {
        perPage: 1,
      },
    },
  });

  artistSlider.mount();

  // About Dream Concert image gallery.
  const dreamConcertMainSlider = new Splide('.dream-concert__slider--main', {
    type: 'loop',
    pagination: false,
  });

  const dreamConcertThumbnailSlider = new Splide(
    '.dream-concert__slider--thumbnail',
    {
      fixedWidth: 80,
      gap: 10,
      rewind: true,
      pagination: false,
      isNavigation: true,
      arrows: false,
      focus: 'center',
      breakpoints: {
        768: {
          fixedWidth: 120,
        },
        576: {
          fixedWidth: 80,
        },
      },
    },
  );

  dreamConcertMainSlider.sync(dreamConcertThumbnailSlider);
  dreamConcertMainSlider.mount();
  dreamConcertThumbnailSlider.mount();
}

ready(start);
