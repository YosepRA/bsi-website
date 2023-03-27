import axios from 'axios';
import { object, string, number } from 'yup';

import walletAPI from './api/wallet-api.js';
import ticketAPI from './api/ticket-api.js';
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
    this.pin = '';
    // this.pinCheck = '';
    // this.pinStep = 'first';
    this.checkTicketEmail = '';
    this.checkTicketPassword = '';

    this.bsiPrice = null;
    this.totalBSI = 0;
    this.unitPrice = 2.5;
    this.unitPriceBSI = null;
    this.totalPrice = 2.5;

    this.dialog = new Dialog();

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

    this.handleUIDChange = this.handleUIDChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePayeeChange = this.handlePayeeChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleExchange = this.handleExchange.bind(this);
    this.handleOTPChange = this.handleOTPChange.bind(this);
    this.handlePinChange = this.handlePinChange.bind(this);
    this.getPrice = this.getPrice.bind(this);
    this.resetErrors = this.resetErrors.bind(this);
    this.showUIDGuide = this.showUIDGuide.bind(this);
    this.showPayeeCodeGuide = this.showPayeeCodeGuide.bind(this);
    this.showCheckTicket = this.showCheckTicket.bind(this);

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

  validatePin() {
    const pinCharacterLimit = 4;
    const pinPattern = /^\d{4}$/;

    if (this.pin.length !== pinCharacterLimit) {
      const pinError = {
        ...this.errors.pin,
        status: true,
        message: `PIN number should only be ${pinCharacterLimit} digits long`,
      };

      this.errors = {
        ...this.errors,
        pin: pinError,
      };

      return false;
    } else if (!pinPattern.test(this.pin)) {
      const pinError = {
        ...this.errors.pin,
        status: true,
        message: 'PIN should only contain numbers',
      };

      this.errors = {
        ...this.errors,
        pin: pinError,
      };

      return false;
    }

    return true;
  }

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
      input?.classList.remove('invalid');
      // Empty error box.
      const errorBox = input?.nextElementSibling;
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
    const otpCharacterLimit = 6;

    if (value.length > otpCharacterLimit) {
      event.target.value = value.substring(0, otpCharacterLimit);

      return undefined;
    }

    this.otp = value;

    return undefined;
  }

  handlePinChange(event) {
    const { value } = event.target;
    const pinCharacterLimit = 4;

    if (value.length > pinCharacterLimit) {
      event.target.value = value.substring(0, pinCharacterLimit);

      return undefined;
    }

    this.pin = value;
  }

  handleCheckTicketEmail(event) {
    const { value } = event.target;

    this.checkTicketEmail = value;
  }

  handleCheckTicketPassword(event) {
    const { value } = event.target;

    this.checkTicketPassword = value;
  }

  async requestOTP() {
    try {
      const data = { email: this.email };

      await walletAPI.requestOTP(data);
    } catch (error) {}
  }

  async verifyOTP() {
    try {
      const data = {
        email: this.email,
        otp: this.otp,
      };
      const res = await walletAPI.verifyOTP(data);

      return res.data;
    } catch (error) {}
  }

  async userRegistration() {
    try {
      const data = new FormData();

      data.append('name', this.email);
      data.append('id', this.email);
      data.append('mobile_auth_key', this.otp);
      data.append('pw', this.password);
      data.append('pw2', this.password);
      data.append('pin', this.pin);

      data.append('country_dial', '1');
      data.append('mobile_num', '01000000000');

      data.append('mode', 'signup');
      data.append('output_type', 'json');
      data.append('is_dev', 'N');
      data.append('btn_submit', '');
      data.append('iagree', 'Y');
      data.append('iagree', 'Y');

      const res = await walletAPI.signup(data);

      this.sendTicketInformation();
    } catch (error) {}
  }

  async sendTicketInformation() {
    try {
      const data = new FormData();

      data.append('go_url', '/'); // Return URL
      data.append('id', this.email); // ID
      data.append('uid', this.uid); // UID
      data.append('payee_code', this.payeeCode); // payee_code
      data.append('count', this.ticketAmount); // ticket count
      data.append('bsi_amount', this.totalBSI); // BSI Amount

      const { data: result } = await ticketAPI.sendTicketInformation(data);

      if (result.code === 200) {
        this.showSuccessTransactionDialog();
      }
    } catch (error) {}

    // What's below this are for testing only.
    const value = {
      uid: this.uid,
      email: this.email,
      payeeCode: this.payeeCode,
      ticketAmount: this.ticketAmount,
      totalBSI: this.totalBSI,
    };

    alert(JSON.stringify(value, null, 2));
  }

  async handleExchange() {
    // console.log(await this.validate());
    const validateResult = await this.validate();
    if (!validateResult) return undefined;

    // Verify Email using OTP.
    await this.requestOTP();
    this.showOTPDialog();

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
    const bodyIcon = document.createElement('img');
    const bodyTitle = document.createElement('h2');
    const bodyInfo = document.createElement('p');
    const bodyInput = document.createElement('input');
    const bodyError = document.createElement('div');

    body.classList.add('dialog__body');

    bodyIcon.src = '/img/dream-concert/Icon Verification.png';
    bodyIcon.classList.add('dialog__body-icon');

    bodyTitle.classList.add('dialog__body-title');
    bodyTitle.textContent = 'Verification';

    bodyInfo.classList.add('dialog__body-info');
    bodyInfo.innerHTML = `Please enter the verification code that was sent to <b>${this.email}</b>`;

    bodyInput.type = 'text';
    bodyInput.name = 'otp';
    bodyInput.id = 'otpInput';
    bodyInput.classList.add('form-control', 'dialog__body-input');
    bodyInput.placeholder = '000-000';
    bodyInput.addEventListener('input', this.handleOTPChange);

    bodyError.classList.add('invalid-feedback');

    body.appendChild(bodyIcon);
    body.appendChild(bodyTitle);
    body.appendChild(bodyInfo);
    body.appendChild(bodyInput);
    body.appendChild(bodyError);

    // Dialog actions.
    const actions = document.createElement('div');
    const actionsOtp = document.createElement('button');
    const actionsResend = document.createElement('p');
    const actionsResendBtn = document.createElement('button');

    const resetOTPInput = () => {
      const otpInput = document.getElementById('otpInput');
      // If it's wrong OTP, reset everything and show error.
      this.otp = '';
      otpInput.value = '';
    };

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

      // Call verify method...
      this.verifyOTP()
        .then((res) => {
          if (res.status === 200) {
            this.dialog.closeDialog();
            // Create pin number.
            this.showPinDialog();
          } else if (res.status === 400) {
            resetOTPInput();
            alert('Wrong email verification code.');
          } else {
            resetOTPInput();
            alert('Server error. Please try again.');
          }
        })
        .catch((error) => {
          resetOTPInput();
          alert('Server error. Please try again.');
        });

      // this.dialog.closeDialog();
      // this.showPinDialog();

      return undefined;
    };

    const handleOTPResend = async () => {
      // Resend and remove resend button.
      await this.requestOTP();

      alert(`Verification code has been sent to ${this.email}`);
      resetOTPInput();
    };

    actions.classList.add('dialog__actions');

    actionsOtp.classList.add('dialog__actions-btn', 'dialog__actions-otp');
    actionsOtp.textContent = 'Verify';
    actionsOtp.addEventListener('click', () => handleOTPVerify());

    actionsResend.classList.add('dialog__actions-resend');
    actionsResend.innerHTML = 'Didn&apos;t receive the email? ';

    actionsResendBtn.classList.add('dialog__actions-resend-btn');
    actionsResendBtn.textContent = 'Resend';
    actionsResendBtn.addEventListener('click', handleOTPResend);

    actionsResend.appendChild(actionsResendBtn);

    actions.appendChild(actionsOtp);
    actions.appendChild(actionsResend);

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
    const bodyError = document.createElement('div');

    body.classList.add('dialog__body');

    bodyTitle.classList.add('dialog__body-title');
    bodyTitle.textContent = 'Create a New Pin';

    bodyInfo.classList.add('dialog__body-info');
    bodyInfo.textContent = 'Please enter a 4-digit number for your pin.';

    bodyInput.type = 'text';
    bodyInput.name = 'pin';
    bodyInput.id = 'pinInput';
    bodyInput.classList.add('form-control', 'dialog__body-input');
    bodyInput.placeholder = '0000';
    bodyInput.addEventListener('input', this.handlePinChange);

    bodyError.classList.add('invalid-feedback');

    body.appendChild(bodyTitle);
    body.appendChild(bodyInfo);
    body.appendChild(bodyInput);
    body.appendChild(bodyError);

    // Dialog actions.
    const actions = document.createElement('div');
    const actionsOtp = document.createElement('button');

    const handlePinSubmit = () => {
      if (!this.validatePin()) {
        const {
          pin: { message, inputId },
        } = this.errors;
        const pinInput = document.getElementById(inputId);
        const errorBox = pinInput.nextElementSibling;

        pinInput.classList.add('invalid');
        errorBox.textContent = message;

        return undefined;
      }

      this.dialog.closeDialog();

      // Handle user registration.
      this.userRegistration();

      return undefined;
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

  showUIDGuide() {
    // Dialog window.
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    // Dialog body.
    const body = document.createElement('div');
    const bodyContent = `
      <h2 class="dialog__body-title">How to find your UID number?</h2>

      <div class="container">
        <div class="row">
          <div class="col-5">
            <div class="dialog__body-left">
              <img src="/img/dream-concert/uid-guide-01.png" alt="UID guide 01" class="dialog__body-uid-image dialog__body-uid-image--01" />
            </div>
          </div>
          <div class="col-7">
            <div class="dialog__body-right">
              <ol class="dialog__body-steps">
                <li class="dialog__body-steps-item">Login to Digifinex</li>
                <li class="dialog__body-steps-item">Go to My Page</li>
                <li class="dialog__body-steps-item">Your user UID will be below your Username</li>
              </ol>
  
              <img src="/img/dream-concert/uid-guide-02.png" alt="UID guide 02" class="dialog__body-uid-image dialog__body-uid-image--02" />
            </div>
          </div>
        </div>
      </div>
    `;
    body.classList.add('dialog__body');
    body.innerHTML = bodyContent;

    // Dialog actions.
    const actions = document.createElement('div');
    const actionsUIDGuide = document.createElement('button');

    const handleUIDClose = () => {
      this.dialog.closeDialog();
    };

    actions.classList.add('dialog__actions');

    actionsUIDGuide.classList.add('dialog__actions-btn', 'dialog__actions-uid');
    actionsUIDGuide.textContent = 'Done';
    actionsUIDGuide.addEventListener('click', () => handleUIDClose());

    actions.appendChild(actionsUIDGuide);

    // Show dialog.
    dialogWindow.appendChild(body);
    dialogWindow.appendChild(actions);

    this.dialog.showDialog(dialogWindow, 'dialog--uid');
  }

  showPayeeCodeGuide() {
    // Dialog window.
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    // Dialog body.
    const body = document.createElement('div');
    const bodyContent = `
      <div id="payeeGuideCarousel" class="carousel slide" data-bs-ride="true">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <h2 class="carousel-item-title">Step 1: Choose receiving account</h2>
            <img src="/img/dream-concert/payee-guide-01.png" class="carousel-item-image" alt="" />
          </div>

          <div class="carousel-item">
            <h2 class="carousel-item-title">Step 2 : Click add new account button</h2>
            <img src="/img/dream-concert/payee-guide-02.png" class="carousel-item-image" alt="" />
          </div>

          <div class="carousel-item">
            <h2 class="carousel-item-title">Step 3 : Check the code in history transaction</h2>
            <img src="/img/dream-concert/payee-guide-03.png" class="carousel-item-image" alt="" />
          </div>
        </div>

        <div class="carousel-indicators">
          <button type="button" data-bs-target="#payeeGuideCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#payeeGuideCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#payeeGuideCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>

        <button class="carousel-control-prev" type="button" data-bs-target="#payeeGuideCarousel" data-bs-slide="prev">
          <span class="carousel-control-icon carousel-control-icon--prev" aria-hidden="true">
            <img src="/img/dream-concert/Icon S Arrow Left.png" alt="Prev" />
          </span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#payeeGuideCarousel" data-bs-slide="next">
          <span class="carousel-control-icon carousel-control-icon--next" aria-hidden="true">
            <img src="/img/dream-concert/Icon S Arrow Right.png" alt="Next" />
          </span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    `;
    body.classList.add('dialog__body');
    body.innerHTML = bodyContent;

    // Dialog actions.
    const actions = document.createElement('div');
    const actionsPayeeGuide = document.createElement('button');

    const handlePayeeClose = () => {
      this.dialog.closeDialog();
    };

    actions.classList.add('dialog__actions');

    actionsPayeeGuide.classList.add(
      'dialog__actions-btn',
      'dialog__actions-payee',
    );
    actionsPayeeGuide.textContent = 'Done';
    actionsPayeeGuide.addEventListener('click', () => handlePayeeClose());

    actions.appendChild(actionsPayeeGuide);

    // Show dialog.
    dialogWindow.appendChild(body);
    dialogWindow.appendChild(actions);

    this.dialog.showDialog(dialogWindow, 'dialog--payee');
  }

  showCheckTicket() {
    // Dialog window.
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    // Dialog body.
    const body = document.createElement('div');
    const bodyTitle = document.createElement('h2');
    const bodyEmailInputSection = document.createElement('div');
    const bodyEmailLabel = document.createElement('label');
    const bodyEmailInput = document.createElement('input');
    const bodyPasswordInputSection = document.createElement('div');
    const bodyPasswordLabel = document.createElement('label');
    const bodyPasswordInput = document.createElement('input');

    body.classList.add('dialog__body');

    bodyTitle.classList.add('dialog__body-title');
    bodyTitle.textContent = 'Request your ticket number';

    bodyEmailInputSection.classList.add('form-section');

    bodyEmailLabel.htmlFor = 'checkTicketEmail';
    bodyEmailLabel.textContent = 'Email';
    bodyEmailLabel.classList.add('form-label');

    bodyEmailInput.type = 'email';
    bodyEmailInput.name = 'checkTicketEmail';
    bodyEmailInput.id = 'checkTicketEmail';
    bodyEmailInput.classList.add('form-control');
    bodyEmailInput.placeholder = 'Enter your email';
    bodyEmailInput.addEventListener('input', this.handleCheckTicketEmail);

    bodyEmailInputSection.appendChild(bodyEmailLabel);
    bodyEmailInputSection.appendChild(bodyEmailInput);

    bodyPasswordInputSection.classList.add('form-section');

    bodyPasswordLabel.htmlFor = 'checkTicketPassword';
    bodyPasswordLabel.textContent = 'Password';
    bodyPasswordLabel.classList.add('form-label');

    bodyPasswordInput.type = 'password';
    bodyPasswordInput.name = 'checkTicketPassword';
    bodyPasswordInput.id = 'checkTicketPassword';
    bodyPasswordInput.classList.add('form-control');
    bodyPasswordInput.placeholder = 'Enter your password';
    bodyPasswordInput.addEventListener('input', this.handleCheckTicketPassword);

    bodyPasswordInputSection.appendChild(bodyPasswordLabel);
    bodyPasswordInputSection.appendChild(bodyPasswordInput);

    body.appendChild(bodyTitle);
    body.appendChild(bodyEmailInputSection);
    body.appendChild(bodyPasswordInputSection);

    // Dialog actions.
    const actions = document.createElement('div');
    const actionsCheckTicket = document.createElement('button');

    const handleCheckTicket = () => {
      this.dialog.closeDialog();

      const data = {
        email: this.checkTicketEmail,
        password: this.checkTicketPassword,
      };

      // Handle check ticket.
      // If success, show result dialog.
      alert('Coming soon');
    };

    actions.classList.add('dialog__actions');

    actionsCheckTicket.classList.add(
      'dialog__actions-btn',
      'dialog__actions-check-ticket',
    );
    actionsCheckTicket.textContent = 'Check your ticket';
    actionsCheckTicket.addEventListener('click', () => handleCheckTicket());

    actions.appendChild(actionsCheckTicket);

    // Show dialog.
    dialogWindow.appendChild(body);
    dialogWindow.appendChild(actions);

    this.dialog.showDialog(dialogWindow, 'dialog--check-ticket');
  }

  showCheckTicketResult(code) {
    // Dialog window.
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    // Dialog body.
    const body = document.createElement('div');
    const bodyContent = `
      <h2 class="dialog__body-title">Your Ticket Number</h2>

      <p class="dialog__body-ticket-result">${code}</p>
    `;
    body.innerHTML = bodyContent;

    // Dialog actions.
    const actions = document.createElement('div');
    const actionsCheckTicketClose = document.createElement('button');
    const actionsCheckTicketCopy = document.createElement('button');

    const handleClose = () => {
      this.dialog.closeDialog();
    };

    const handleCopy = () => {
      this.dialog.closeDialog();

      // Handle code copy...
    };

    actions.classList.add('dialog__actions');

    actionsCheckTicketClose.classList.add(
      'dialog__actions-btn',
      'dialog__actions-check-ticket-result',
      'dialog__actions-check-ticket-result--close',
    );
    actionsCheckTicketClose.textContent = 'Close';
    actionsCheckTicketClose.addEventListener('click', () => handleClose());

    actionsCheckTicketCopy.classList.add(
      'dialog__actions-btn',
      'dialog__actions-check-ticket-result',
      'dialog__actions-check-ticket-result--close',
    );
    actionsCheckTicketCopy.textContent = 'Copy';
    actionsCheckTicketCopy.addEventListener('click', () => handleCopy());

    actions.appendChild(actionsCheckTicketClose);
    actions.appendChild(actionsCheckTicketCopy);

    // Show dialog.
    dialogWindow.appendChild(body);
    dialogWindow.appendChild(actions);

    this.dialog.showDialog(dialogWindow, 'dialog--check-ticket-result');
  }

  resetState() {}
}

export default Ticket;
