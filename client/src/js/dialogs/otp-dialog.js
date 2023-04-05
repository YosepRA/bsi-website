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
  }

  handleOTPChange(event) {
    const {
      target: { value },
    } = event;

    this.otp = value;
  }

  resetOTPInput() {
    const otpInput = document.getElementById('otpInput');
    // If it's wrong OTP, reset everything and show error.
    this.otp = '';
    otpInput.value = '';
  }

  async requestOTP() {
    try {
      const data = { email: this.email };

      await walletAPI.requestOTP(data);
    } catch (error) {}
  }

  async verifyOTP() {
    const data = {
      email: this.email,
      otp: this.otp,
    };

    const res = await walletAPI.verifyOTP(data);

    return res.data;
  }

  // async verifyOTP() {
  //   const data = {
  //     email: this.email,
  //     otp: this.otp,
  //   };
  //   const [
  //     {
  //       data: { status },
  //     },
  //     otpError,
  //   ] = await promiseResolver(walletAPI.verifyOTP(data));

  //   if (otpError) {
  //     const {
  //       response: { data },
  //     } = otpError;

  //     if (data.status === 400) {
  //       this.resetOTPInput();
  //       alert('Incorrect email verification code.');

  //       return {
  //         status: false,
  //         code: 400,
  //         message: 'Incorrect email verification code.',
  //       };
  //     } else {
  //       this.resetOTPInput();
  //       alert('Server error. Please try again.');

  //       return {
  //         status: false,
  //         code: null,
  //         message: 'Server error.',
  //       };
  //     }
  //   }

  //   if (status === 200) {
  //     return {
  //       status: true,
  //       code: 200,
  //     };
  //   }
  // }

  start(email) {
    return new Promise((resolve, reject) => {
      this.email = email;

      this.requestOTP();
      this.showOTPDialog(resolve);
    });
  }

  closeOTPDialog() {}

  showOTPDialog(resolve) {
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
            this.closeOTPDialog();
            this.userRegistration();
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

    this.showDialog(dialogWindow, this.dialogClassName);
  }
}

export default OTPDialog;
