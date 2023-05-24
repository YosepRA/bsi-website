import { object, string, number } from 'yup';

import walletAPI from './api/wallet-api.js';
import ticketAPI from './api/ticket-api.js';
import tokenAPI from './api/token-api.js';
import Dialog from './dialogs/dialog.js';
import UIDDialog from './dialogs/uid-guide-dialog.js';
import PayeeDialog from './dialogs/payee-guide-dialog.js';
import TxIDDialog from './dialogs/txid-guide-dialog.js';
import OTPDialog from './dialogs/otp-dialog.js';
import { promiseResolver } from './helpers.js';

const uidInput = document.getElementById('uidInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const passwordInputEye = document.querySelector(
  '.banner__ticket-form__input-icon--password',
);
const amountInput = document.getElementById('amountInput');
const totalPriceOne = document.querySelector(
  '.banner__ticket-form__info-price',
);
const totalPriceTwo = document.querySelector(
  '.banner__ticket-form__total-dollar',
);
const totalBSI = document.querySelector('.banner__ticket-form__total-bsi');
const unitPriceBSI = document.querySelector(
  '.banner__ticket-form__unit-price-amount',
);

class Ticket {
  constructor() {
    // Inputs.
    this.uid = '';
    this.email = '';
    this.password = '';
    this.showPassword = false;
    this.ticketAmount = 1;

    // Check ticket form states.
    this.checkTicketEmail = '';
    this.checkTicketUID = '';
    this.checkTicketPayeeCode = '';
    this.checkTicketTxID = '';

    this.bsiPrice = null;
    this.totalBSI = 0;
    this.unitPrice = 2.5;
    this.unitPriceBSI = null;
    this.totalPrice = 2.5;

    // Validation system.
    this.ticketSchema = object({
      uid: string()
        .matches(/^\d+$/, 'UID should only contains numbers')
        .required('Fill your UID'),
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
    };

    // Check ticket error validation schema.

    this.checkTicketSchema = object({
      email: string()
        .required('Fill your email')
        .email('Please enter a valid email'),
      uid: string()
        .matches(/^\d+$/, 'UID should only contains numbers')
        .required('Fill your UID'),
      txId: string().required('Fill your TxID'),
      payeeCode: string(),
    });

    this.checkTicketErrors = {
      email: { status: false, message: '', inputId: 'checkTicketEmail' },
      uid: { status: false, message: '', inputId: 'checkTicketUID' },
      txId: { status: false, message: '', inputId: 'checkTicketTxID' },
      payeeCode: {
        status: false,
        message: '',
        inputId: 'checkTicketPayeeCode',
      },
    };

    this.handleUIDChange = this.handleUIDChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordShowToggle = this.handlePasswordShowToggle.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleAmountButton = this.handleAmountButton.bind(this);
    this.handleExchange = this.handleExchange.bind(this);
    this.getPrice = this.getPrice.bind(this);
    this.resetErrors = this.resetErrors.bind(this);
    this.showCheckTicket = this.showCheckTicket.bind(this);
    this.handleCheckTicketEmail = this.handleCheckTicketEmail.bind(this);
    this.handleCheckTicketUID = this.handleCheckTicketUID.bind(this);
    this.handleCheckTicketPayee = this.handleCheckTicketPayee.bind(this);
    this.handleCheckTicketTxID = this.handleCheckTicketTxID.bind(this);
    this.resetCheckTicketError = this.resetCheckTicketError.bind(this);
    this.resetState = this.resetState.bind(this);

    // Initialize.
    this.dialog = new Dialog('dialog', this.resetState);
    this.uidDialog = new UIDDialog('dialog--uid');
    this.payeeDialog = new PayeeDialog('dialog--payee');
    this.txIdDialog = new TxIDDialog('dialog--txid');
    this.otpDialog = new OTPDialog('dialog--otp', this.resetState);

    this.render();
    this.getPrice().then(() => {
      this.calculate();
    });
  }

  render() {
    uidInput.value = this.uid;
    emailInput.value = this.email;
    passwordInput.value = this.password;
    amountInput.value = this.ticketAmount;

    totalPriceOne.textContent = this.totalPrice;
    totalPriceTwo.textContent = `$${this.totalPrice}`;
    unitPriceBSI.textContent = `${this.unitPriceBSI} BSI`;
    totalBSI.textContent = this.totalBSI;
  }

  resetState() {
    // Inputs.
    this.uid = '';
    this.email = '';
    this.password = '';
    this.ticketAmount = 1;

    // Check ticket form states.
    this.checkTicketEmail = '';
    this.checkTicketUID = '';
    this.checkTicketPayeeCode = '';
    this.checkTicketTxID = '';

    // Render front page inputs.
    // Reset ticket price calculation and render it.
    this.calculate();
  }

  async getPrice() {
    const result = await tokenAPI.getPrice();

    this.bsiPrice = result.data.price;

    this.calculate();
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
      // This is where all the errors from Yup stored.
      error.inner.forEach(({ path, message }) => {
        const newField = { ...this.errors[path], status: true, message };

        this.errors = { ...this.errors, [path]: newField };
      });

      this.renderInputError();

      return false;
    }
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
      if (errorBox !== undefined) errorBox.textContent = '';
    });

    this.errors = reset;
  }

  /* ======================= Check Ticket Validation ======================= */

  async validateCheckTicket() {
    try {
      const data = {
        email: this.checkTicketEmail,
        uid: this.checkTicketUID,
        txId: this.checkTicketTxID,
        payeeCode: this.checkTicketPayeeCode,
      };

      await this.checkTicketSchema.validate(data, {
        abortEarly: false,
      });

      return true;
    } catch (error) {
      // It's where all the errors from Yup stored.
      error.inner.forEach(({ path, message }) => {
        const newField = {
          ...this.checkTicketErrors[path],
          status: true,
          message,
        };

        this.checkTicketErrors = {
          ...this.checkTicketErrors,
          [path]: newField,
        };
      });

      this.renderCheckTicketInputError();

      return false;
    }
  }

  renderCheckTicketInputError() {
    Object.keys(this.checkTicketErrors)
      .filter((key) => this.checkTicketErrors[key].status)
      .forEach((key) => {
        const { message, inputId } = this.checkTicketErrors[key];
        const input = document.getElementById(inputId);
        const errorBox = input.nextElementSibling;

        input.classList.add('invalid');
        errorBox.textContent = message;
      });
  }

  resetCheckTicketError() {
    const reset = {};

    Object.keys(this.checkTicketErrors).forEach((key) => {
      const value = this.checkTicketErrors[key];
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
      if (errorBox !== undefined) errorBox.textContent = '';
    });

    this.checkTicketErrors = reset;
  }

  /* ======================= Event Handlers ======================= */

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

  handlePasswordShowToggle() {
    passwordInputEye.classList.toggle('show');

    const next = !this.showPassword;

    passwordInput.type = next ? 'text' : 'password';

    this.showPassword = next;
  }

  handleAmountChange(event) {
    const { value } = event.target;
    const valueNum = value !== '' ? parseInt(value, 10) : 0;

    this.ticketAmount = valueNum;

    this.calculate();
  }

  handleAmountButton(change) {
    if (change === -1 && this.ticketAmount === 1) {
      return undefined;
    }

    if (change === 1) {
      this.ticketAmount = this.ticketAmount + 1;
    } else {
      this.ticketAmount = this.ticketAmount - 1;
    }

    this.calculate();

    return undefined;
  }

  handleCheckTicketEmail(event) {
    const { value } = event.target;

    this.checkTicketEmail = value;
  }

  handleCheckTicketUID(event) {
    const { value } = event.target;

    this.checkTicketUID = value;
  }

  handleCheckTicketPayee(event) {
    const { value } = event.target;

    this.checkTicketPayeeCode = value;
  }

  handleCheckTicketTxID(event) {
    const { value } = event.target;

    this.checkTicketTxID = value;
  }

  async userRegistration() {
    try {
      const data = new FormData();

      data.append('name', this.email);
      data.append('id', this.email);
      data.append('mobile_auth_key', this.otpDialog.otp);
      data.append('pw', this.password);
      data.append('pw2', this.password);
      data.append('pin', ''); // Pin is optional.

      data.append('country_dial', '1');
      data.append('mobile_num', '01000000000');

      data.append('mode', 'signup');
      data.append('output_type', 'json');
      data.append('is_dev', 'N');
      data.append('btn_submit', '');
      data.append('iagree', 'Y');
      data.append('iagree', 'Y');

      const res = await walletAPI.signup(data);

      return true;
    } catch (error) {}
  }

  async sendTicketInformation() {
    try {
      const data = new FormData();

      data.append('go_url', '/'); // Return URL
      data.append('id', this.email); // ID
      data.append('uid', this.uid); // UID
      data.append('count', this.ticketAmount); // ticket count
      data.append('bsi_amount', this.totalBSI); // BSI Amount

      const { data: result } = await ticketAPI.sendTicketInformation(data);

      if (result.code === '200') {
        // this.showSuccessTransactionDialog();
        this.showSuccessExchange(data);
      } else if (result.code === '502') {
        this.showSubmittedIDDialog();
      }
    } catch (error) {
      this.showServerError();
    }
  }

  async sendTicketConfirmation() {
    try {
      const data = new FormData();

      data.append('go_url', '/'); // Return URL
      data.append('id', this.checkTicketEmail); // ID
      data.append('uid', this.checkTicketUID); // UID
      data.append('payee_code', this.checkTicketPayeeCode); // payee_code
      data.append('txid', this.checkTicketTxID); // ticket count

      const { data: result } = await ticketAPI.sendTicketConfirmation(data);

      if (result.code === '200') {
        this.showSuccessTicketConfirmation();
      } else if (result.code === '502') {
        this.showNoTicketHistory();
      }
    } catch (error) {
      this.showServerError();
    }
  }

  async handleExchange() {
    // const data = new FormData();
    // data.append('bsi_amount', this.totalBSI);
    // this.showSuccessExchange(data);
    // this.showSubmittedIDDialog();
    // this.showNoTicketHistory();
    // this.showSuccessTicketConfirmation();
    // this.showCheckTicket();
    // this.showGeneralError(
    //   'Server Error',
    //   'There seem to be a server error coming from us. Please try again.',
    // );
    // this.showServerError();

    // return undefined;

    const validateResult = await this.validate();
    if (!validateResult) return undefined;

    // 1. Verify OTP.
    const [otpResult, error] = await promiseResolver(
      this.otpDialog.start(this.email),
    );

    if (error) {
      alert('Server error. Please try again later.');
      this.resetState();

      return undefined;
    }

    // 2. User registration.
    await this.userRegistration();

    // 3. Send ticket information.
    await this.sendTicketInformation();

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
    const actionsTransmission = document.createElement('button');

    const handleActionsClose = () => {
      this.dialog.closeDialog();
      this.resetState();
    };

    const handleActionsTransmission = () => {
      this.dialog.closeDialog();
      this.resetState();
      this.showCheckTicket();
    };

    actions.classList.add('dialog__actions');

    actionsClose.classList.add('dialog__actions-btn', 'dialog__actions-close');
    actionsClose.textContent = 'Close';
    actionsClose.addEventListener('click', () => handleActionsClose());

    actionsTransmission.classList.add(
      'dialog__actions-btn',
      'dialog__actions-transmission',
    );
    actionsTransmission.textContent = 'Transmission Confirmation';
    actionsTransmission.addEventListener('click', () =>
      handleActionsTransmission(),
    );

    actions.appendChild(actionsClose);
    actions.appendChild(actionsTransmission);

    // Show dialog.
    dialogWindow.appendChild(body);
    dialogWindow.appendChild(actions);

    this.dialog.showDialog(dialogWindow, 'dialog--success');
  }

  showSuccessExchange(data) {
    // Dialog window.
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    const bodyContent = `
      <div class="dialog__body">
        <img src="/img/dream-concert/success-icon.png" alt="" class="dialog__body-icon" />

        <h2 class="dialog__body-title">Success!</h2>

        <p class="dialog__body-info">Please continue with transferring BSI to our Event Account UID <b>(691265286)</b> in <a href="https://www.digifinex.com/en-ww/" target="_blank" rel="noreferrer">Digifinex page.</a></p>

        <div class="dialog__body__withdraw">
          <p class="dialog__body__withdraw-title">Your withdrawal amount</p>

          <div class="dialog__body__withdraw-amount">
            <div class="dialog__body__withdraw-amount__number">${data.get(
              'bsi_amount',
            )}</div>

            <button type="button" class="dialog__body__withdraw-amount__copy">Copy</button>
          </div>

          <p class="dialog__body__withdraw-time">
            &#42;Please complete the withdrawal process within 12 hours
          </p>

          <div class="form-check dialog__body__withdraw-copy-check">
            <input class="form-check-input" type="checkbox" value="" id="withdrawAmountCopyCheck">
            <label class="form-check-label" for="withdrawAmountCopyCheck">
              I have copied the withdrawal amount for Digifinex
            </label>
          </div>
        </div>
      </div>
      
      <div class="dialog__actions">
        <button class="dialog__actions-btn dialog__actions-close disabled" disabled>Close</button>
        <a href="https://www.digifinex.com/en-ww/" target="_blank" rel="noreferrer" class="dialog__actions-btn dialog__actions-go-digifinex">Continue to Digifinex</a>
      </div>
    `;

    dialogWindow.innerHTML = bodyContent;

    /* ======================= Assign Event Handlers ======================= */

    const copyBtn = dialogWindow.querySelector(
      '.dialog__body__withdraw-amount__copy',
    );
    const closeCheckbox = dialogWindow.querySelector(
      '.dialog__body__withdraw-copy-check .form-check-input',
    );
    const closeBtn = dialogWindow.querySelector('.dialog__actions-close');

    const handleCopy = () => {
      navigator.clipboard.writeText(this.totalBSI).then(() => {
        copyBtn.textContent = 'Copied!';
        copyBtn.disabled = true;

        const disableTime = 1000;

        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.disabled = false;
        }, disableTime);
      });
    };

    const handleCloseCheckbox = (event) => {
      const { checked } = event.target;

      if (checked) {
        closeBtn.classList.remove('disabled');
        closeBtn.disabled = false;
      } else {
        closeBtn.classList.add('disabled');
        closeBtn.disabled = true;
      }
    };

    const handleClose = () => {
      this.dialog.closeDialog(null, 'dialog--exchange-success');
      this.resetState();
    };

    copyBtn.addEventListener('click', () => handleCopy());
    closeCheckbox.addEventListener('change', handleCloseCheckbox);
    closeBtn.addEventListener('click', handleClose);

    this.dialog.showDialog(dialogWindow, 'dialog--exchange-success');
  }

  // showSuccessTicketConfirmation() {
  //   // Dialog window.
  //   const dialogWindow = document.createElement('div');
  //   dialogWindow.classList.add('dialog__window');

  //   // Dialog body.
  //   const body = document.createElement('div');
  //   const bodyIcon = document.createElement('img');
  //   const bodyTitle = document.createElement('h2');
  //   const bodyInfo = document.createElement('p');

  //   body.classList.add('dialog__body');

  //   bodyIcon.classList.add('dialog__body-icon');
  //   bodyIcon.src = '/img/dream-concert/success-icon.png';

  //   bodyTitle.classList.add('dialog__body-title');
  //   bodyTitle.textContent = 'Successful!';

  //   bodyInfo.classList.add('dialog__body-info');
  //   bodyInfo.textContent =
  //     'Token transfer confirmation request has been completed.';

  //   body.appendChild(bodyIcon);
  //   body.appendChild(bodyTitle);
  //   body.appendChild(bodyInfo);

  //   // Dialog actions.
  //   const actions = document.createElement('div');
  //   const actionsClose = document.createElement('button');

  //   const handleActionsClick = () => {
  //     this.dialog.closeDialog();
  //   };

  //   actions.classList.add('dialog__actions');

  //   actionsClose.classList.add('dialog__actions-btn', 'dialog__actions-close');
  //   actionsClose.textContent = 'Close';
  //   actionsClose.addEventListener('click', () => handleActionsClick());

  //   actions.appendChild(actionsClose);

  //   // Show dialog.
  //   dialogWindow.appendChild(body);
  //   dialogWindow.appendChild(actions);

  //   this.dialog.showDialog(dialogWindow, 'dialog--success-confirmation');
  // }

  showSuccessTicketConfirmation() {
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    const bodyContent = `
      <div class="dialog dialog--success-confirmation">
        <div class="dialog__overlay"></div>

        <div class="dialog__window">
          <div class="dialog__body">
            <img src="/img/dream-concert/success-icon.png" alt="" class="dialog__body-icon" />

            <h2 class="dialog__body-title">Successful!</h2>

            <p class="dialog__body-info">Transmission confirmation request has been completed.</p>
            <p class="dialog__body-info dialog__body-info--note">Your ticket will be sent to your email after we have confirmed its validity.</p>
          </div>
          
          <div class="dialog__actions">
            <button class="dialog__actions-btn dialog__actions-close">Close</button>
          </div>
        </div>
      </div>
    `;

    dialogWindow.innerHTML = bodyContent;

    /* ======================= Event Handler Assignment ======================= */

    const closeBtn = dialogWindow.querySelector('.dialog__actions-close');

    const handleClose = () => {
      this.dialog.closeDialog();
      this.resetState();
    };

    closeBtn.addEventListener('click', () => handleClose());

    this.dialog.showDialog(dialogWindow, 'dialog--success-confirmation');
  }

  showSubmittedIDDialog() {
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    const bodyContent = `
      <div class="dialog__body">
        <img src="/img/dream-concert/fail-icon.png" alt="" class="dialog__body-icon" />

        <h2 class="dialog__body-title">Request Submitted</h2>

        <p class="dialog__body-info">You have submitted your exchange request using this email address.</p>
      </div>
      
      <div class="dialog__actions">
        <button class="dialog__actions-btn dialog__actions-close">Close</button>
      </div>
    `;

    dialogWindow.innerHTML = bodyContent;

    /* ======================= Event Handler Assignment ======================= */

    const closeBtn = dialogWindow.querySelector('.dialog__actions-close');

    const handleClose = () => {
      this.dialog.closeDialog();
      this.resetState();
    };

    closeBtn.addEventListener('click', () => handleClose());

    this.dialog.showDialog(dialogWindow, 'dialog--submitted');
  }

  // showNoTicketHistory() {
  //   // Dialog window.
  //   const dialogWindow = document.createElement('div');
  //   dialogWindow.classList.add('dialog__window');

  //   // Dialog body.
  //   const body = document.createElement('div');
  //   const bodyIcon = document.createElement('img');
  //   const bodyTitle = document.createElement('h2');
  //   const bodyInfo = document.createElement('p');

  //   body.classList.add('dialog__body');

  //   bodyIcon.classList.add('dialog__body-icon');
  //   bodyIcon.src = '/img/dream-concert/fail-icon.png';

  //   bodyTitle.classList.add('dialog__body-title');
  //   bodyTitle.textContent = 'Something is wrong';

  //   bodyInfo.classList.add('dialog__body-info');
  //   bodyInfo.textContent = 'Ticket request history is not found.';

  //   body.appendChild(bodyIcon);
  //   body.appendChild(bodyTitle);
  //   body.appendChild(bodyInfo);

  //   // Dialog actions.
  //   const actions = document.createElement('div');
  //   const actionsClose = document.createElement('button');

  //   const handleActionsClick = () => {
  //     this.dialog.closeDialog();
  //   };

  //   actions.classList.add('dialog__actions');

  //   actionsClose.classList.add('dialog__actions-btn', 'dialog__actions-close');
  //   actionsClose.textContent = 'Close';
  //   actionsClose.addEventListener('click', () => handleActionsClick());

  //   actions.appendChild(actionsClose);

  //   // Show dialog.
  //   dialogWindow.appendChild(body);
  //   dialogWindow.appendChild(actions);

  //   this.dialog.showDialog(dialogWindow, 'dialog--no-ticket-history');
  // }

  showNoTicketHistory() {
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    const bodyContent = `
      <div class="dialog dialog--no-ticket-history">
        <div class="dialog__overlay"></div>

        <div class="dialog__window">
          <div class="dialog__body">
            <img src="/img/dream-concert/fail-icon.png" alt="" class="dialog__body-icon" />

            <h2 class="dialog__body-title">Not Found</h2>

            <p class="dialog__body-info">Ticket exchange request is not found.</p>
            <p class="dialog__body-info dialog__body-info--note">Please make sure you have entered the correct data, and you have submitted your ticket exchange request.</p>
          </div>
          
          <div class="dialog__actions">
            <button class="dialog__actions-btn dialog__actions-close">Close</button>
          </div>
        </div>
      </div>      
    `;

    dialogWindow.innerHTML = bodyContent;

    /* ======================= Event Handler Assignment ======================= */

    const closeBtn = dialogWindow.querySelector('.dialog__actions-close');

    const handleClose = () => {
      this.dialog.closeDialog();
      this.resetState();
    };

    closeBtn.addEventListener('click', () => handleClose());

    this.dialog.showDialog(dialogWindow, 'dialog--no-ticket-history');
  }

  showCheckTicket() {
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    const bodyContent = `
      <div class="dialog dialog--check-ticket">
        <div class="dialog__overlay"></div>

        <div class="dialog__window">
          <div class="dialog__body">
            <h2 class="dialog__body-title">Transmission Confirmation</h2>

            <div class="form-section">
              <label for="checkTicketEmail" class="form-label">
                Email
              </label>
              <input type="text" class="form-control" id="checkTicketEmail" placeholder="Enter your email" />
              <div class="invalid-feedback"></div>
            </div>

            <div class="form-section">
              <label for="checkTicketUID" class="form-label">
                UID
                <button class="form-label__guide-btn form-label__guide-btn--check-ticket-uid"><img src="/img/dream-concert/Icon S Help.png" alt="Help" /></button>
              </label>
              <input type="text" class="form-control" id="checkTicketUID" placeholder="Enter your UID" />
              <div class="invalid-feedback"></div>
            </div>

            <div class="form-section">
              <label for="checkTicketTxID" class="form-label">
                TxID
                <button class="form-label__guide-btn form-label__guide-btn--check-ticket-txid"><img src="/img/dream-concert/Icon S Help.png" alt="Help" /></button>
              </label>
              <input type="text" class="form-control" id="checkTicketTxID" placeholder="Enter your TxID" />
              <div class="invalid-feedback"></div>
            </div>

            <div class="form-section">
              <label for="checkTicketPayeeCode" class="form-label">
                Payee code
                <button class="form-label__guide-btn form-label__guide-btn--check-ticket-payee">
                  <img src="/img/dream-concert/Icon S Help.png" alt="Help" />
                </button>
              </label>
              <input type="text" class="form-control" id="checkTicketPayeeCode" placeholder="(Optional)" />

              <div class="invalid-feedback"></div>

              <div id="payeeHelp" class="form-text dialog__input-help">
                <span class="dialog__input-help-icon">
                  <img src="/img/dream-concert/Icon S Information.png" alt="" />
                </span> 

                <span class="dialog__input-help-text">
                  See more information
                </span>

                <div class="dialog__input-help-caution">
                  <p class="dialog__input-help-caution__text">&ast; Only to users who set-up to receive the code.</p>
                  <p class="dialog__input-help-caution__text">&ast;&ast; Time is required to check this stage. This may delay the time of sending the ticket.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="dialog__actions">
            <button class="dialog__actions-btn dialog__actions-check-ticket">Submit</button>
          </div>
        </div>
      </div>
    `;

    dialogWindow.innerHTML = bodyContent;

    /* ======================= Event Handler Assignment ======================= */

    const emailInput = dialogWindow.querySelector('#checkTicketEmail');
    const uidInput = dialogWindow.querySelector('#checkTicketUID');
    const txidInput = dialogWindow.querySelector('#checkTicketTxID');
    const payeeCodeInput = dialogWindow.querySelector('#checkTicketPayeeCode');
    const uidHelpBtn = dialogWindow.querySelector(
      '.form-label__guide-btn--check-ticket-uid',
    );
    const txidHelpBtn = dialogWindow.querySelector(
      '.form-label__guide-btn--check-ticket-txid',
    );
    const payeeHelpBtn = dialogWindow.querySelector(
      '.form-label__guide-btn--check-ticket-payee',
    );
    const submitBtn = dialogWindow.querySelector(
      '.dialog__actions-check-ticket',
    );

    const inputs = [emailInput, uidInput, txidInput, payeeCodeInput];

    const handleSubmit = async () => {
      const validateResult = await this.validateCheckTicket();
      if (!validateResult) return undefined;

      this.dialog.closeDialog();
      this.sendTicketConfirmation();

      return undefined;
    };

    emailInput.addEventListener('input', this.handleCheckTicketEmail);
    uidInput.addEventListener('input', this.handleCheckTicketUID);
    txidInput.addEventListener('input', this.handleCheckTicketTxID);
    payeeCodeInput.addEventListener('input', this.handleCheckTicketPayee);

    uidHelpBtn.addEventListener('click', () => {
      this.uidDialog.showUIDDialog();
    });
    txidHelpBtn.addEventListener('click', () => {
      this.txIdDialog.showTxIDDialog();
    });
    payeeHelpBtn.addEventListener('click', () => {
      this.payeeDialog.showPayeeDialog();
    });

    submitBtn.addEventListener('click', () => handleSubmit());

    inputs.forEach((input) => {
      input.addEventListener('focus', this.resetCheckTicketError);
    });

    this.dialog.showDialog(dialogWindow, 'dialog--check-ticket');
  }

  showGeneralError(title, message) {
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    const bodyContent = `
        <div class="dialog__body">
          <img src="/img/dream-concert/fail-icon.png" alt="" class="dialog__body-icon" />
          <h2 class="dialog__body-title dialog__body-title--error">${title}</h2>
          <p class="dialog__body-info">${message}</p>
        </div>
        
        <div class="dialog__actions">
          <button class="dialog__actions-btn dialog__actions-close">Close</button>
        </div>
      `;

    dialogWindow.innerHTML = bodyContent;

    /* ======================= Event Handler Assignment ======================= */

    const closeBtn = dialogWindow.querySelector('.dialog__actions-close');

    const handleClose = () => {
      this.dialog.closeDialog(null, 'dialog--general-error');
      this.resetState();
    };

    closeBtn.addEventListener('click', () => handleClose());

    this.dialog.showDialog(dialogWindow, 'dialog--general-error');
  }

  showServerError() {
    this.showGeneralError(
      'Server Error',
      'There seem to be a server error coming from us. Please try again.',
    );
  }
}

export default Ticket;
