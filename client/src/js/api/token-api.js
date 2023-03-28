import axios from 'axios';

import config from './config.js';

const baseUrl = config.rootBaseUrl;

const tokenAPI = {
  async getPrice() {
    const res = await axios.get(`${baseUrl}/bsi/price`);

    return res;
  },
};

export default tokenAPI;
