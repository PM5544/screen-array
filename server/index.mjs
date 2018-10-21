import { IO, controlServer, clientsServer } from './io';
import * as registeredSockets from './registeredSockets';
import server from './server';
import sendToSockets from './sendToSockets';
import getAllAnimationsPaths from './getAllAnimationsPaths';
// import './audio';

IO.attach(server, {
  transports: ['websocket']
});

controlServer.on('connection', function(co) {
  [
    'addLayer',
    'blackOutOn',
    'blackOutOff',
    'changeColor',
    'clearLayer',
    'disable',
    'disableAll',
    'enable',
    'enableAll',
    'flashOn',
    'flashOff',
    'identify',
    'loadAnimation',
    'resetLayer',
    'setParameters',
    'setSocketNumber',
    'restartAnimation'
  ].forEach(type => {
    co.on(type, function(instructions) {
      console.log(type, instructions);
      sendToSockets(type, instructions);
    });
  });

  co.on('refresh', function(instructions) {
    registeredSockets.reset();
    registeredSockets.sockets.clear();
    sendToSockets('refresh', instructions);
  });

  co.on('sendAllAnimationPaths', async function() {
    co.emit('allAnimationPaths', await getAllAnimationsPaths());
  });

  co.on('sendAllClientIds', function() {
    // console.log('sendAllClientIds');

    clientsServer.clients((err, clientIds) => {
      const registered = Array.from(registeredSockets.sockets.entries()).reduce(
        (prev, cur) => Object.assign(prev, { [cur[0]]: cur[1] }),
        {}
      );

      co.emit('allClientIds', {
        clientIds,
        registered,
        left: registeredSockets.socketsLeftValues,
        right: registeredSockets.socketsRightValues
      });

      registeredSockets.socketsLeftValues.forEach((socketId, index, ar) => {
        sendToSockets('setClientPosition', {
          targets: 'byId',
          id: socketId,
          data: { index, total: ar.length, mirrored: true }
        });
      });
      registeredSockets.socketsRightValues.forEach((socketId, index, ar) => {
        sendToSockets('setClientPosition', {
          targets: 'byId',
          id: socketId,
          data: { index, total: ar.length, mirrored: false }
        });
      });
    });
    // sockets.emit({ to, data: { id: client.id }, type: 'identify' });
  });
});

clientsServer.on('connection', function(cl) {
  cl.on('setSocketNumber', function(data) {
    const { socketNumber } = data;
    registeredSockets.set(socketNumber, cl.id);
  });
  cl.emit('getSocketNumber');
});
clientsServer.on('reconnect', function(cl) {
  cl.emit('getSocketNumber');
});

server.listen(1337);
