import { object, string, number } from 'yup';

import Dialog from './dialog.js';
import walletAPI from '../api/wallet-api.js';
import { promiseResolver } from '../helpers.js';

class OTPDialog extends Dialog {
  constructor(dialogClassName = 'dialog--otp') {
    super(dialogClassName);
    this.otp = '';
    this.email = '';

    this.errors = {
      otp: { status: false, message: '', inputId: 'otpInput' },
    };

    this.handleOTPChange = this.handleOTPChange.bind(this);
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

  resetOTPInput() {
    const otpInput = document.getElementById('otpInput');
    // If it's a wrong OTP, reset everything and show error.
    this.otp = '';
    otpInput.value = '';
  }

  async requestOTP(reject) {
    try {
      const data = { email: this.email };

      await walletAPI.requestOTP(data);
    } catch (error) {
      // Server or CORS errors, show general error dialog.
    }
  }

  async verifyOTP() {
    const data = {
      email: this.email,
      otp: this.otp,
    };

    const res = await walletAPI.verifyOTP(data);

    return res.data;
  }

  start(email) {
    return new Promise((resolve, reject) => {
      this.email = email;

      this.requestOTP(reject);
      this.showOTPDialog(resolve, reject);
    });
  }

  closeOTPDialog() {
    this.closeDialog(null, this.dialogClassName);
  }

  showOTPDialog(resolve, reject) {
    // Dialog window.
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    const bodyContent = `
      <div class="dialog__body">
        <img src="/img/dream-concert/Icon Verification.png" alt="" class="dialog__body-icon" />

        <h2 class="dialog__body-title">Verification</h2>

        <p class="dialog__body-info">Please enter the verification code that was sent to <b>${this.email}</b></p>

        <input type="text" name="otp" id="otpInput" class="form-control dialog__body-input" placeholder="000-000" />
        <div class="invalid-feedback"></div>
      </div>
      
      <div class="dialog__actions">
        <button class="dialog__actions-btn dialog__actions-otp">Verify</button>

        <p class="dialog__actions-resend">Didn&apos;t receive the email? <button class="dialog__actions-resend-btn">Resend</button></p>
      </div>
    `;

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
            this.closeOTPDialog();
            // Go back to Ticket 'handleExchange' function.
            resolve(true);
          }
        })
        .catch((error) => {
          const {
            response: { data },
          } = error;

          if (data.status === 400) {
            resetOTPInput();
            alert('Incorrect email verification code.');
          } else {
            resetOTPInput();
            alert('Server error. Please try again.');
          }
        });

      return undefined;
    };

    const handleOTPResend = async () => {
      // Resend and remove resend button.
      await this.requestOTP();

      alert(`Verification code has been sent to ${this.email}`);
      resetOTPInput();
    };

    dialogWindow.innerHTML = bodyContent;

    /* ======================= Event Handler Assignment ======================= */

    const otpInput = dialogWindow.querySelector('#otpInput');
    const verifyBtn = dialogWindow.querySelector('.dialog__actions-otp');
    const resendBtn = dialogWindow.querySelector('.dialog__actions-resend');

    otpInput.addEventListener('input', this.handleOTPChange);
    verifyBtn.addEventListener('click', handleOTPVerify);
    resendBtn.addEventListener('click', handleOTPResend);

    this.showDialog(dialogWindow, this.dialogClassName);
  }
}

export default OTPDialog;
