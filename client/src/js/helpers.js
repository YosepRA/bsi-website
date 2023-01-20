function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function throttle(fn, delay) {
  let prev = Date.now();

  return function throttleFunction() {
    const now = Date.now();

    if (now - prev > delay) {
      fn();

      prev = now;
    }
  };
}

export { ready, throttle };
