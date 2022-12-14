function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

async function fetchLatestPrice() {
  const baseUrl = '/api/v1';

  const data = await fetch(`${baseUrl}/price`).then((res) => res.json());

  return data;
}

async function updatePriceData() {
  const navbarPriceData = document.querySelector('.navbar__price-data');

  const data = await fetchLatestPrice();
  console.log('🚀 ~ file: global.js:21 ~ updatePriceData ~ data', data);

  navbarPriceData.textContent = data.price;
}

function fetchPriceOnInterval(delay) {
  setInterval(updatePriceData, delay);
}

async function globalInit() {
  await updatePriceData();

  fetchPriceOnInterval(5000);
}

// ready(globalInit);
