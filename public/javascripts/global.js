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
  const navbarPriceTime = document.querySelector('.navbar__price-time');

  const data = await fetchLatestPrice();
  const priceText = `$${data.price}`;
  const changeText = `${data.change24Hr > 0 ? '+' : ''}${
    Math.round(data.change24Hr * 100) / 100
  }%`;
  const timeText = new Date(data.lastUpdatedAt).toLocaleString();

  navbarPriceData.textContent = priceText;
  navbarPriceChange.textContent = changeText;
  navbarPriceTime.textContent = timeText;

  // Toggle 24 hour change text color.
  if (data.change24Hr > 0) {
    navbarPriceChange.classList.add('navbar__price-change--up');
    navbarPriceChange.classList.remove('navbar__price-change--down');
  } else {
    navbarPriceChange.classList.add('navbar__price-change--down');
    navbarPriceChange.classList.remove('navbar__price-change--up');
  }
}

function fetchPriceOnInterval(delay) {
  setInterval(updatePriceData, delay);
}

async function globalInit() {
  await updatePriceData();

  fetchPriceOnInterval(30000);
}

// ready(globalInit);
