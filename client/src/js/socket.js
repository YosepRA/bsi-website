import { io } from 'socket.io-client';

import { updatePriceData } from './live-price.js';

const socket = io('/');

socket.on('connect', () => {
  console.log('Connected to Socket');
});

socket.on('price', updatePriceData);

export default socket;
