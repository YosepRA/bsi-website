const { Server } = require('socket.io');

function startSocket(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Socket ID:', socket.id);

    socket.on('disconnect', () => {
      console.log('Socket client is disconnected.');
    });
  });

  return io;
}

module.exports = startSocket;
