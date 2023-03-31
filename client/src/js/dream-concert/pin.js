import axios from 'axios';
import { object, string } from 'yup';

import walletAPI from '../api/wallet-api.js';
import Ticket from '../ticket.js';
import Dialog from '../dialog.js';

class Pin {
  constructor() {
    this.pin = '';

    this.ticket = new Ticket();
    this.dialog = new Dialog();
  }

  validate() {}

  handlePinChange(event) {
    const { value } = event.target;

    this.pin = value;
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
}

export default Pin;
