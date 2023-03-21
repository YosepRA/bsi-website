import axios from 'axios';

import { ready } from './helpers.js';

const uidInput = document.getElementById('uidInput');
const emailInput = document.getElementById('emailInput');
const payeeInput = document.getElementById('payeeInput');
const amountInput = document.getElementById('amountInput');
const totalPrice = document.querySelector('.banner__ticket-form__info-price');
const totalBSI = document.querySelector('.banner__ticket-form__total-bsi');

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
    this.totalPrice = 2.5;

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

    totalPrice.textContent = this.totalPrice;
    totalBSI.textContent = this.totalBSI;
  }

  async getPrice() {
    const result = await axios.get('/api/v1/bsi/price');

    this.bsiPrice = result.data.price;
  }

  calculate() {
    // Calculate total price.
    const totalPrice = this.ticketAmount * this.unitPrice;

    // Calculate total BSI.
    const totalBSI = totalPrice / this.bsiPrice;

    // Update all states.
    this.totalPrice = totalPrice;
    this.totalBSI = totalBSI;

    this.render();
  }
}

function start() {
  const ticket = new Ticket();
}

ready(start);
