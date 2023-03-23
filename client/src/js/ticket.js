import axios from 'axios';

import Dialog from './dialog.js';

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

const walletBaseUrl = 'https://api.wallet.bsin.io';

class Ticket {
  constructor() {
    // Inputs.
    this.uid = '';
    this.email = '';
    this.payeeCode = '';
    this.ticketAmount = 1;
    this.otp = '';

    this.bsiPrice = null;
    this.totalBSI = 0;
    this.unitPrice = 2.5;
    this.unitPriceBSI = null;
    this.totalPrice = 2.5;

    this.dialog = new Dialog();

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

  handleOTPChange(event) {
    const { value } = event.target;

    this.otp = value;
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

    // Verify Email using OTP.

    // On successful email verification, execute user registration.

    // Finally, send ticket exchange data to Event DB.

    this.showOTPDialog();
    // this.showSuccessDialog();
    // this.showFailDialog();
  }

  showSuccessDialog() {
    // Dialog window.
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    // Dialog body.
    const body = document.createElement('div');
    const bodyIcon = document.createElement('img');
    const bodyTitle = document.createElement('h2');
    const bodyInfo = document.createElement('p');

    body.classList.add('dialog__body');

    bodyIcon.classList.add('dialog__body-icon');
    bodyIcon.src = '/img/dream-concert/success-icon.png';

    bodyTitle.classList.add('dialog__body-title');
    bodyTitle.textContent = 'Transaction Success!';

    bodyInfo.classList.add('dialog__body-info');
    bodyInfo.textContent =
      'Tickets will be distributed sequentially from the 1st of April.';

    body.appendChild(bodyIcon);
    body.appendChild(bodyTitle);
    body.appendChild(bodyInfo);

    // Dialog actions.
    const actions = document.createElement('div');
    const actionsClose = document.createElement('button');

    const handleActionsClick = () => {
      this.dialog.closeDialog();
    };

    actions.classList.add('dialog__actions');

    actionsClose.classList.add('dialog__actions-btn', 'dialog__actions-close');
    actionsClose.textContent = 'Close';
    actionsClose.addEventListener('click', () => handleActionsClick());

    actions.appendChild(actionsClose);

    // Show dialog.
    dialogWindow.appendChild(body);
    dialogWindow.appendChild(actions);

    this.dialog.showDialog(dialogWindow, 'dialog--success');
  }

  showFailDialog() {
    // Dialog window.
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    // Dialog body.
    const body = document.createElement('div');
    const bodyIcon = document.createElement('img');
    const bodyTitle = document.createElement('h2');
    const bodyInfo = document.createElement('p');

    body.classList.add('dialog__body');

    bodyIcon.classList.add('dialog__body-icon');
    bodyIcon.src = '/img/dream-concert/fail-icon.png';

    bodyTitle.classList.add('dialog__body-title');
    bodyTitle.textContent = 'Insufficient Token!';

    bodyInfo.classList.add('dialog__body-info');
    bodyInfo.textContent =
      'Please purchase your BSI token first via Digifinex to continue the transaction process.';

    body.appendChild(bodyIcon);
    body.appendChild(bodyTitle);
    body.appendChild(bodyInfo);

    // Dialog actions.
    const actions = document.createElement('div');
    const actionsClose = document.createElement('button');
    const actionsBuy = document.createElement('a');

    const handleActionsClick = () => {
      this.dialog.closeDialog();
    };

    actions.classList.add('dialog__actions');

    actionsClose.classList.add('dialog__actions-btn', 'dialog__actions-close');
    actionsClose.textContent = 'Close';
    actionsClose.addEventListener('click', () => handleActionsClick());

    actionsBuy.classList.add('dialog__actions-btn', 'dialog__actions-buy');
    actionsBuy.href = 'https://www.digifinex.com/en-ww/trade/USDT/BSI';
    actionsBuy.target = '_blank';
    actionsBuy.rel = 'noreferrer';
    actionsBuy.textContent = 'Buy BSI';
    actionsBuy.addEventListener('click', () => handleActionsClick());

    actions.appendChild(actionsClose);
    actions.appendChild(actionsBuy);

    // Show dialog.
    dialogWindow.appendChild(body);
    dialogWindow.appendChild(actions);

    this.dialog.showDialog(dialogWindow, 'dialog--fail');
  }

  showOTPDialog() {
    // Dialog window.
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    // Dialog body.
    const body = document.createElement('div');
    const bodyTitle = document.createElement('h2');
    const bodyInfo = document.createElement('p');
    const bodyInput = document.createElement('input');

    body.classList.add('dialog__body');

    bodyTitle.classList.add('dialog__body-title');
    bodyTitle.textContent = 'Please enter your OTP';

    bodyInfo.classList.add('dialog__body-info');
    bodyInfo.textContent = 'Your OTP has been sent to your_name@mail.com.';

    bodyInput.type = 'text';
    bodyInput.name = 'otp';
    bodyInput.id = 'otp';
    bodyInput.classList.add('dialog__body-input');
    bodyInput.placeholder = '000-000';

    body.appendChild(bodyTitle);
    body.appendChild(bodyInfo);
    body.appendChild(bodyInput);

    // Dialog actions.
    const actions = document.createElement('div');
    const actionsOtp = document.createElement('button');

    const handleActionsClick = () => {
      this.dialog.closeDialog();
    };

    const handleOTPVerify = () => {
      this.dialog.closeDialog();

      this.showSuccessDialog();
    };

    actions.classList.add('dialog__actions');

    actionsOtp.classList.add('dialog__actions-btn', 'dialog__actions-otp');
    actionsOtp.textContent = 'Verify';
    actionsOtp.addEventListener('click', () => handleOTPVerify());

    actions.appendChild(actionsOtp);

    // Show dialog.
    dialogWindow.appendChild(body);
    dialogWindow.appendChild(actions);

    this.dialog.showDialog(dialogWindow, 'dialog--otp');
  }
}

export default Ticket;
