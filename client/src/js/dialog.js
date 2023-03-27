class Dialog {
  constructor() {
    this.show = false;
    this.node = null; // Full node.
  }

  render(node, dialogClass) {
    if (!this.show) {
      const dialog = document.querySelector('.dialog');
      dialog.remove();

      return undefined;
    }

    const dialog = document.createElement('div');
    const dialogOverlay = document.createElement('div');

    dialog.classList.add('dialog', dialogClass);
    dialogOverlay.classList.add('dialog__overlay');
    dialogOverlay.addEventListener('click', () => this.closeDialog());

    dialog.appendChild(dialogOverlay);
    dialog.appendChild(node);

    document.body.appendChild(dialog);
  }

  showDialog(node, dialogClass) {
    this.show = true;
    this.node = node;

    this.render(node, dialogClass);
  }

  closeDialog() {
    this.show = false;
    this.node = null;

    this.render();
  }
}

export default Dialog;
