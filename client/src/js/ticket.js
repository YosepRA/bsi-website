import axios from 'axios';
import { object, string, number, date, InferType } from 'yup';

import Dialog from './dialog.js';

const uidInput = document.getElementById('uidInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const payeeInput = document.getElementById('payeeInput');
const amountInput = document.getElementById('amountInput');
const totalPriceOne = document.querySelector(
  '.banner__ticket-form__info-price',
);
const totalPriceTwo = document.querySelector(
  '.banner__ticket-form__total-dollar',
);
const totalBSI = document.querySelector('.banner__ticket-form__total-bsi');
// const unitPriceBSI = document.querySelector('.panel__info-bsi-unit');
const unitPriceBSI = document.querySelector(
  '.banner__ticket-form__unit-price-amount',
);

const walletBaseUrl = 'https://api.wallet.bsin.io';

class Ticket {
  constructor() {
    // Inputs.
    this.uid = '';
    this.email = '';
    this.password = '';
    this.payeeCode = '';
    this.ticketAmount = 1;
    this.otp = '';
    this.pinNumber = '';
    this.pinNumberCheck = '';
    this.pinNumberStep = 'first';

    this.bsiPrice = null;
    this.totalBSI = 0;
    this.unitPrice = 2.5;
    this.unitPriceBSI = null;
    this.totalPrice = 2.5;

    // Validation system.
    this.ticketSchema = object({
      uid: string().required('Fill your UID'),
      email: string()
        .required('Fill your email')
        .email('Please enter a valid email'),
      password: string().required('Fill your password'),
      ticketAmount: number()
        .required('Fill your ticket amount')
        .min(1, 'Minimum purchase is 1 ticket'),
    });

    this.errors = {
      uid: { status: false, message: '', inputId: 'uidInput' },
      email: { status: false, message: '', inputId: 'emailInput' },
      password: { status: false, message: '', inputId: 'passwordInput' },
      ticketAmount: { status: false, message: '', inputId: 'amountInput' },
      otp: { status: false, message: '', inputId: 'otpInput' },
      pin: { status: false, message: '', inputId: 'pinInput' },
    };

    this.dialog = new Dialog();

    this.handleUIDChange = this.handleUIDChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePayeeChange = this.handlePayeeChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleOTPChange = this.handleOTPChange.bind(this);
    this.handleExchange = this.handleExchange.bind(this);
    this.getPrice = this.getPrice.bind(this);
    this.resetErrors = this.resetErrors.bind(this);

    // Initialize.
    this.render();
    this.getPrice().then(() => {
      this.calculate();
    });
  }

  render() {
    uidInput.value = this.uid;
    emailInput.value = this.email;
    passwordInput.value = this.password;
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

  async validate() {
    try {
      const data = {
        uid: this.uid,
        email: this.email,
        password: this.password,
        ticketAmount: this.ticketAmount,
      };

      await this.ticketSchema.validate(data, {
        abortEarly: false,
      });

      return true;
    } catch (error) {
      // It's where all the errors from Yup stored.
      error.inner.forEach(({ path, message }) => {
        const newField = { ...this.errors[path], status: true, message };

        this.errors = { ...this.errors, [path]: newField };
      });

      this.renderInputError();

      return false;
    }
  }

  validateOTP() {
    // Only six digits.
    // const pattern = /^\d{6}$/;

    if (this.otp.length !== 6) {
      const otpError = {
        ...this.errors.otp,
        status: true,
        message: 'OTP should only be 6 digits long',
      };

      this.errors = {
        ...this.errors,
        otp: otpError,
      };

      return false;
    }

    return true;
  }

  validatePin() {}

  renderInputError() {
    Object.keys(this.errors)
      .filter((key) => this.errors[key].status)
      .forEach((key) => {
        const { message, inputId } = this.errors[key];
        const input = document.getElementById(inputId);
        const errorBox = input.nextElementSibling;

        input.classList.add('invalid');
        errorBox.textContent = message;
      });
  }

  resetErrors() {
    const reset = {};

    Object.keys(this.errors).forEach((key) => {
      const value = this.errors[key];
      reset[key] = {
        ...value,
        status: false,
        message: '',
      };

      // Remove "invalid" class.
      const input = document.getElementById(value.inputId);
      input.classList.remove('invalid');
      // Empty error box.
      const errorBox = input.nextElementSibling;
      errorBox.textContent = '';
    });

    this.errors = reset;
  }

  handleUIDChange(event) {
    const { value } = event.target;

    this.uid = value;
  }

  handleEmailChange(event) {
    const { value } = event.target;

    this.email = value;
  }

  handlePasswordChange(event) {
    const { value } = event.target;

    this.password = value;
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

    if (value.length <= 6) {
      this.otp = value;
    }
  }

  handlePinChange(event) {
    const { value } = event.target;

    this.pinNumber = value;
  }

  async requestOTP() {
    try {
      await axios.post(`${walletBaseUrl}/v1/auth/email/bsi/request`, {
        email: this.email,
      });
    } catch (error) {}
  }

  async verifyOTP() {
    try {
      const body = {
        email: this.email,
        otp: this.otp,
      };
      const res = await axios.post(
        `${walletBaseUrl}/v1/auth/email/bsi/confirm`,
        body,
      );

      if (res.status === 200) {
        this.userRegistration();
      }
    } catch (error) {}
  }

  async userRegistration() {
    try {
      const data = new FormData();

      data.append('id', this.email);
      data.append('mobile_auth_key', this.otp);
      data.append('pw', this.password);
      data.append('pw2', this.password);
      data.append('pin', this.pinNumber);

      data.append('mode', 'signup');
      data.append('output_type', 'json');
      data.append('is_dev', 'N');
      data.append('btn_submit', '');
      data.append('iagree', 'Y');
      data.append('iagree', 'Y');

      const res = await axios.post(`${walletBaseUrl}/auth/signup_proc`);

      if (res.status === 200) {
        this.sendTicketInformation();
      }
    } catch (error) {}
  }

  async sendTicketInformation() {
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

  async handleExchange() {
    // console.log(await this.validate());
    const validateResult = await this.validate();
    if (!validateResult) return undefined;

    // Verify Email using OTP.
    // await this.requestOTP();
    this.showOTPDialog();

    // On successful email verification, create user 4 digit pin number.

    // Perform user account registration.

    // Finally, send ticket exchange data to Event DB.

    return undefined;
  }

  showSuccessTransactionDialog() {
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

  showInsufficientTokenDialog() {
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
    const bodyError = document.createElement('div');

    body.classList.add('dialog__body');

    bodyTitle.classList.add('dialog__body-title');
    bodyTitle.textContent = 'Please enter your OTP';

    bodyInfo.classList.add('dialog__body-info');
    bodyInfo.textContent = `Your OTP has been sent to ${this.email}`;

    bodyInput.type = 'text';
    bodyInput.name = 'otp';
    bodyInput.id = 'otpInput';
    bodyInput.classList.add('dialog__body-input');
    bodyInput.placeholder = '000-000';
    bodyInput.addEventListener('input', this.handleOTPChange);

    bodyError.classList.add('invalid-feedback');

    body.appendChild(bodyTitle);
    body.appendChild(bodyInfo);
    body.appendChild(bodyInput);
    body.appendChild(bodyError);

    // Dialog actions.
    const actions = document.createElement('div');
    const actionsOtp = document.createElement('button');

    const handleOTPVerify = () => {
      // if (!this.validateOTP()) {
      //   const {
      //     otp: { message, inputId },
      //   } = this.errors;
      //   const otpInput = document.getElementById(inputId);
      //   const errorBox = otpInput.nextElementSibling;

      //   otpInput.classList.add('invalid');
      //   errorBox.textContent = message;

      //   return undefined;
      // }

      this.dialog.closeDialog();

      // Call verify method...

      // Create pin number.
      this.showPinDialog();

      return undefined;
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

  showPinDialog() {
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
    bodyTitle.textContent = 'Create a New Pin';

    bodyInfo.classList.add('dialog__body-info');
    bodyInfo.textContent = 'Please enter a 4-digit number for your pin.';

    bodyInput.type = 'text';
    bodyInput.name = 'pin';
    bodyInput.id = 'pinInput';
    bodyInput.classList.add('dialog__body-input');
    bodyInput.placeholder = '0000';
    bodyInput.addEventListener('input', this.handlePinChange);

    body.appendChild(bodyTitle);
    body.appendChild(bodyInfo);
    body.appendChild(bodyInput);

    // Dialog actions.
    const actions = document.createElement('div');
    const actionsOtp = document.createElement('button');

    const handlePinSubmit = () => {
      this.dialog.closeDialog();

      this.showSuccessTransactionDialog();
    };

    actions.classList.add('dialog__actions');

    actionsOtp.classList.add('dialog__actions-btn', 'dialog__actions-pin');
    actionsOtp.textContent = 'Submit';
    actionsOtp.addEventListener('click', () => handlePinSubmit());

    actions.appendChild(actionsOtp);

    // Show dialog.
    dialogWindow.appendChild(body);
    dialogWindow.appendChild(actions);

    this.dialog.showDialog(dialogWindow, 'dialog--pin');
  }

  showUIDGuide() {}

  showPayeeCodeGuide() {}

  resetState() {}
}

export default Ticket;
