import axios from 'axios';
import { object, string } from 'yup';

import walletAPI from '../api/wallet-api.js';
import Dialog from '../dialog.js';

class OTP {
  constructor() {
    this.otp = '';
    this.email = '';

    this.dialog = new Dialog();

    // Validation schema.
    this.schema = object({
      otp: string().required('Fill your OTP'),
    });

    // Event handler bindings.
    this.handleOTPChange = this.handleOTPChange.bind(this);
  }

  validate() {}

  handleOTPChange(event) {
    const { value } = event.target;

    if (value.length <= 6) {
      this.otp = value;
    }
  }

  async requestOTP() {
    try {
      const data = { email: this.email };

      await walletAPI.requestOTP(data);
    } catch (error) {}
  }

  async verifyOTP(data) {
    try {
      const data = {
        email: this.email,
        otp: this.otp,
      };
      const res = await walletAPI.verifyOTP(data);

      return res;
    } catch (error) {}
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
}

export default OTP;
