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
  const navbarPriceChange = document.querySelector('.navbar__price-change');

  const data = await fetchLatestPrice();
  const priceText = data.price;
  const changeText = `${data.change24Hr > 0 ? '+' : ''}${
    Math.round(data.change24Hr * 100) / 100
  }%`;

  navbarPriceData.textContent = priceText;
  navbarPriceChange.textContent = changeText;
}

function fetchPriceOnInterval(delay) {
  setInterval(updatePriceData, delay);
}

async function globalInit() {
  await updatePriceData();

  fetchPriceOnInterval(30000);
}

// ready(globalInit);
