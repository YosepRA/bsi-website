import axios from 'axios';

import config from './config.js';

const baseUrl = config.walletBaseUrl;

const walletAPI = {
  async requestOTP(data) {
    const res = await axios.post(
      `${walletBaseUrl}/v1/auth/email/bsi/request`,
      data,
    );

    return res;
  },
  async verifyOTP(data) {
    const res = await axios.post(
      `${walletBaseUrl}/v1/auth/email/bsi/confirm`,
      data,
    );

    return res;
  },
  async signup(data) {},
};

export const walletBaseUrl = baseUrl;
export default walletAPI;
