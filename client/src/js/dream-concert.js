import axios from 'axios';

import { ready } from './helpers.js';

const uidInput = document.getElementById('uidInput');
const emailInput = document.getElementById('emailInput');
const payeeInput = document.getElementById('payeeInput');
const amountInput = document.getElementById('amountInput');
const totalPriceOne = document.querySelector(
  '.banner__ticket-form__info-price',
);
const totalPriceTwo = document.querySelector(
  '.banner__ticket-form__total-dollar',
);
const totalBSI = document.querySelector('.banner__ticket-form__total-bsi');
const unitPriceBSI = document.querySelector('.panel__info-bsi-unit');
const exchangeButton = document.querySelector(
  '.banner__footer-actions-exchange',
);
const dreamConcertBuy = document.querySelector('.dream-concert__info-buy');

class Ticket {
  constructor() {
    // Inputs.
    this.uid = '';
    this.email = '';
    this.payeeCode = '';
    this.ticketAmount = 1;

    this.bsiPrice = null;
    this.totalBSI = 0;
    this.unitPrice = 2.5;
    this.unitPriceBSI = null;
    this.totalPrice = 2.5;

    this.handleUIDChange = this.handleUIDChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePayeeChange = this.handlePayeeChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleExchange = this.handleExchange.bind(this);
    this.getPrice = this.getPrice.bind(this);

    // Initialize.
    this.render();
    this.getPrice().then(() => {
      this.calculate();
    });
  }

  render() {
    uidInput.value = this.uid;
    emailInput.value = this.email;
    payeeInput.value = this.payeeCode;
    amountInput.value = this.ticketAmount;

    totalPriceOne.textContent = this.totalPrice;
    totalPriceTwo.textContent = `$${this.totalPrice}`;
    unitPriceBSI.textContent = `${this.unitPriceBSI} BSI`;
    totalBSI.textContent = this.totalBSI;
  }

  async getPrice() {
    const result = await axios.get(
      'https://openapi.digifinex.com/v3/ticker?symbol=bsi_usdt',
    );

    this.bsiPrice = result.data.ticker[0].last;

    this.render();
  }

  calculate() {
    // Calculate unit BSI price.
    const unitPriceBSI =
      Math.floor((this.unitPrice / this.bsiPrice) * 100000) / 100000;

    // Calculate total price.
    const totalPrice = this.ticketAmount * this.unitPrice;

    // Calculate total BSI.
    const totalBSI = Math.floor((totalPrice / this.bsiPrice) * 100000) / 100000;

    // Update all states.
    this.unitPriceBSI = unitPriceBSI;
    this.totalPrice = totalPrice;
    this.totalBSI = totalBSI;

    this.render();
  }

  handleUIDChange(event) {
    const { value } = event.target;

    this.uid = value;
  }

  handleEmailChange(event) {
    const { value } = event.target;

    this.email = value;
  }

  handlePayeeChange(event) {
    const { value } = event.target;

    this.payeeCode = value;
  }

  handleAmountChange(event) {
    const { value } = event.target;
    const valueNum = value !== '' ? parseInt(value, 10) : 0;

    this.ticketAmount = valueNum;

    this.calculate();
  }

  handleExchange() {
    const value = {
      uid: this.uid,
      email: this.email,
      payeeCode: this.payeeCode,
      ticketAmount: this.ticketAmount,
      bsiPrice: this.bsiPrice,
      totalBSI: this.totalBSI,
    };

    alert(JSON.stringify(value, null, 2));
  }
}

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
  emailInput.addEventListener('input', ticket.handleEmailChange);
  payeeInput.addEventListener('input', ticket.handlePayeeChange);
  amountInput.addEventListener('input', ticket.handleAmountChange);
  exchangeButton.addEventListener('click', ticket.handleExchange);
  dreamConcertBuy.addEventListener('click', handleDreamConcertBuy);

  const pollInterval = 60000;
  const pricePollInterval = pricePoll(pollInterval, ticket);
}

ready(start);
