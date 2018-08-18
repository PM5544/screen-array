const io = require('socket.io')();
const clientsServer = io.of('/clients');
const controlServer = io.of('/control');

module.exports = {
  io,
  clientsServer,
  controlServer
};
