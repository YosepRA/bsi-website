import axios from 'axios';

import config from './config.js';

const baseUrl = config.walletBaseUrl;
const legacyBaseUrl = config.legacyWalletBaseUrl;

const walletAPI = {
  async requestOTP(data) {
    const res = await axios.post(`${baseUrl}/v1/auth/email/bsi/request`, data);

    return res;
  },
  async verifyOTP(data) {
    const res = await axios.post(`${baseUrl}/v1/auth/email/bsi/confirm`, data);

    return res;
  },
  async signup(data) {
    const res = await axios.post(`${legacyBaseUrl}/auth/signup_proc`, data);

    return res;
  },
};

export const walletBaseUrl = baseUrl;
export default walletAPI;
