class Dialog {
  constructor(dialogClassName = 'dialog', cleanFn = () => {}) {
    this.show = false;
    this.node = null; // Full node.
    this.dialogClassName = dialogClassName;
    this.cleanFn = cleanFn;
  }

  render(node, dialogClass = 'dialog') {
    if (!this.show) {
      const dialog = document.querySelector(`.${dialogClass}`);
      dialog.remove();

      return undefined;
    }

    const dialog = document.createElement('div');
    const dialogOverlay = document.createElement('div');

    dialog.classList.add('dialog', dialogClass);
    dialogOverlay.classList.add('dialog__overlay');
    dialogOverlay.addEventListener('click', () => {
      this.closeDialog(null, this.dialogClassName);
      this.cleanFn();
    });

    dialog.appendChild(dialogOverlay);
    dialog.appendChild(node);

    document.body.appendChild(dialog);

    return undefined;
  }

  showDialog(node, dialogClass) {
    this.show = true;
    this.node = node;

    this.render(node, dialogClass);
  }

  closeDialog(node, dialogClass) {
    this.show = false;
    this.node = null;

    this.render(node, dialogClass);
  }
}

export default Dialog;
