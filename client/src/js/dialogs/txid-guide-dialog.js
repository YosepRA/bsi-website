import Dialog from './dialog.js';

class TxIDDialog extends Dialog {
  constructor(dialogClassName) {
    super(dialogClassName);
  }

  closeTxIDDialog() {
    this.closeDialog(null, this.dialogClassName);
  }

  showTxIDDialog() {
    // Dialog window.
    const dialogWindow = document.createElement('div');
    dialogWindow.classList.add('dialog__window');

    // Dialog body.
    const body = document.createElement('div');
    const bodyContent = `
      <div id="txidGuideCarousel" class="carousel slide" data-bs-ride="false" data-bs-wrap="false">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <h2 class="carousel-item-title">Step 1: Click Withdraw</h2>
            <img src="/img/dream-concert/txid-guide-01.png" class="carousel-item-image" alt="" />
          </div>

          <div class="carousel-item">
            <h2 class="carousel-item-title">Step 2 : You can find the TxID below the time</h2>
            <img src="/img/dream-concert/txid-guide-02.png" class="carousel-item-image" alt="" />
          </div>
        </div>

        <div class="carousel-indicators">
          <button type="button" data-bs-target="#txidGuideCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#txidGuideCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
        </div>

        <button class="carousel-control-prev" type="button" data-bs-target="#txidGuideCarousel" data-bs-slide="prev">
          <span class="carousel-control-icon carousel-control-icon--prev" aria-hidden="true">
            <img src="/img/dream-concert/Icon S Arrow Left.png" alt="Prev" />
          </span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#txidGuideCarousel" data-bs-slide="next">
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
    const actionsTxIDGuide = document.createElement('button');

    actions.classList.add('dialog__actions');

    actionsTxIDGuide.classList.add(
      'dialog__actions-btn',
      'dialog__actions-txid',
    );
    actionsTxIDGuide.textContent = 'Done';
    actionsTxIDGuide.addEventListener('click', () => this.closeTxIDDialog());

    actions.appendChild(actionsTxIDGuide);

    // Show dialog.
    dialogWindow.appendChild(body);
    dialogWindow.appendChild(actions);

    this.showDialog(dialogWindow, this.dialogClassName);
  }
}

export default TxIDDialog;
