function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function throttle(fn, delay) {
  let start = Date.now();

  return function throttleFunction() {
    const now = Date.now();

    // If the specified delay time has passed. Run it.
    if (now - start > delay) {
      fn();

      start = now;
    }
  };
}

export { ready, throttle };
