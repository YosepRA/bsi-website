import Dialog from './dialog.js';

class UIDDialog extends Dialog {
  constructor(dialogClassName) {
    super(dialogClassName);
  }

  closeUIDDialog() {
    this.closeDialog(null, this.dialogClassName);
  }

  showUIDDialog() {
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

    actions.classList.add('dialog__actions');

    actionsUIDGuide.classList.add('dialog__actions-btn', 'dialog__actions-uid');
    actionsUIDGuide.textContent = 'Done';
    actionsUIDGuide.addEventListener('click', () => this.closeUIDDialog());

    actions.appendChild(actionsUIDGuide);

    // Show dialog.
    dialogWindow.appendChild(body);
    dialogWindow.appendChild(actions);

    this.showDialog(dialogWindow, this.dialogClassName);
  }
}

export default UIDDialog;
