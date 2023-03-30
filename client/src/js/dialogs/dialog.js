class Dialog {
  constructor(dialogClassName = 'dialog') {
    this.show = false;
    this.node = null; // Full node.
    this.dialogClassName = dialogClassName;
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
    dialogOverlay.addEventListener('click', () =>
      this.closeDialog(null, this.dialogClassName),
    );

    dialog.appendChild(dialogOverlay);
    dialog.appendChild(node);

    document.body.appendChild(dialog);
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
