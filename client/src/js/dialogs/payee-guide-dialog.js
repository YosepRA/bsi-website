import Dialog from './dialog.js';

class PayeeDialog extends Dialog {
  constructor(dialogClassName) {
    super(dialogClassName);
  }

  closePayeeDialog() {
    this.closeDialog(null, this.dialogClassName);
  }

  showPayeeDialog() {
    // Dialog window.
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    // Dialog body.
    const body = document.createElement('div');
    const bodyContent = `
      <div id="payeeGuideCarousel" class="carousel slide" data-bs-ride="false" data-bs-wrap="false">
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

    actions.classList.add('dialog__actions');

    actionsPayeeGuide.classList.add(
      'dialog__actions-btn',
      'dialog__actions-payee',
    );
    actionsPayeeGuide.textContent = 'Done';
    actionsPayeeGuide.addEventListener('click', () => this.closePayeeDialog());

    actions.appendChild(actionsPayeeGuide);

    // Show dialog.
    dialogWindow.appendChild(body);
    dialogWindow.appendChild(actions);

    this.showDialog(dialogWindow, this.dialogClassName);
  }
}

export default PayeeDialog;
