import { io } from 'socket.io-client';

import { updatePriceData } from './live-price.js';

function startSocket() {
  const socket = io('/');

  socket.on('connect', () => {
    console.log('Connected to Socket');
  });

  socket.on('price', updatePriceData);
}

export default startSocket;
