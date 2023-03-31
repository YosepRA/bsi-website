import axios from 'axios';

import config from './config.js';

const baseUrl = config.legacyWalletBaseUrl;

const ticketAPI = {
  async sendTicketInformation(data) {
    const res = await axios.post(`${baseUrl}/auth/ticketing_proc`, data);

    return res;
  },
  async sendTicketConfirmation(data) {
    const res = await axios.post(`${baseUrl}/auth/ticketing_check_proc`, data);

    return res;
  },
};

export const ticketBaseUrl = baseUrl;
export default ticketAPI;
