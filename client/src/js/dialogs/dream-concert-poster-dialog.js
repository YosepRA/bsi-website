import Dialog from './dialog.js';

class DreamConcertPosterDialog extends Dialog {
  constructor(dialogClassName) {
    super(dialogClassName);
  }

  closePosterDialog() {
    this.closeDialog(null, this.dialogClassName);
  }

  showPosterDialog() {
    // Dialog window.
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    // Dialog body.
    const body = document.createElement('div');
    const bodyCloseButton = document.createElement('button');
    const bodyContent = `
      <a href="/en/bsi-dream-concert-event">
        <img src="/img/dream-concert-poster.png" alt="29th Dream Concert with Digifinex" class="dialog__body-poster" />
      </a>
    `;

    bodyCloseButton.classList.add('dialog__body-close');
    bodyCloseButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    bodyCloseButton.addEventListener('click', () => this.closePosterDialog());

    body.classList.add('dialog__body');
    body.innerHTML = bodyContent;
    body.appendChild(bodyCloseButton);

    // Show dialog.
    dialogWindow.appendChild(body);

    this.showDialog(dialogWindow, this.dialogClassName);
  }
}

export default DreamConcertPosterDialog;
