import { throttle } from './helpers.js';

// It will only provide vertical (y) scroll data for now.
class ScrollControl {
  constructor(fns) {
    this.position = 0;
    this.direction = '';
    this.fns = fns || [];

    const handleScroll = throttle(this.updateScroll.bind(this), 200);

    window.addEventListener('scroll', handleScroll);
  }

  updateScroll() {
    const newPosition = window.scrollY;
    const newDirection = newPosition - this.position >= 0 ? 'down' : 'up';

    this.position = newPosition;
    this.direction = newDirection;

    this.callFunctions();
  }

  callFunctions() {
    // Invoke all functions attached to this instance.
    const promises = this.fns.map(
      (fn) =>
        new Promise((resolve) =>
          resolve(fn({ position: this.position, direction: this.direction })),
        ),
    );

    return Promise.all(promises);
  }
}

export default ScrollControl;
