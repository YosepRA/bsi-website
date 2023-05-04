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

async function promiseResolver(promise) {
  try {
    const data = await promise;
    return [data, null];
  } catch (err) {
    return [null, err];
  }
}

export { ready, throttle, promiseResolver };
