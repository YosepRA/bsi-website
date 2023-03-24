import Ticket from './ticket.js';
import Countdown from './countdown.js';
import { ready } from './helpers.js';

const uidInput = document.getElementById('uidInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const payeeInput = document.getElementById('payeeInput');
const amountInput = document.getElementById('amountInput');
const exchangeButton = document.querySelector(
  '.banner__footer-actions-exchange',
);
const dreamConcertBuy = document.querySelector('.dream-concert__info-buy');

function handleDreamConcertBuy() {
  window.scroll({ top: 0, left: 0, behavior: 'smooth' });
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
  payeeInput.addEventListener('input', ticket.handlePayeeChange);
  amountInput.addEventListener('input', ticket.handleAmountChange);
  amountInput.addEventListener('focus', ticket.resetErrors);
  exchangeButton.addEventListener('click', ticket.handleExchange);
  dreamConcertBuy.addEventListener('click', handleDreamConcertBuy);

  // BSI price polling.
  const pollInterval = 60000;
  const pricePollInterval = pricePoll(pollInterval, ticket);

  // Countdown.
  const countDownDate = new Date('May 27, 2023 00:00:00').getTime();
  const countDown = new Countdown(countDownDate);

  countDown.startTimer();
}

ready(start);
