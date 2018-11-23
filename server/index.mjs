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
    'blackOutOff',
    'blackOutOn',
    'clearLayer',
    'disableAllLayers',
    'disableLayer',
    'enableAllLayers',
    'enableLayer',
    'flashOff',
    'flashOn',
    'identify',
    'loadAnimation',
    'restartAnimation',
    'setLayerProperties'
  ].forEach(type => {
    co.on(type, function(instructions) {
      // console.log(type, instructions);
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

  // co.on('setSocketNumber', function() {
  //   registeredSockets.set('control', co.id);
  // });

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
        // console.log(socketId, index, ar.length, true );
        sendToSockets('setClientPosition', {
          targets: 'byId',
          id: socketId,
          data: { clientIndexOnSide: index, clientCountOnSide: ar.length, clientIsMirrored: true }
        });
      });
      registeredSockets.socketsRightValues.forEach((socketId, index, ar) => {
        // console.log(socketId, index, ar.length, false );
        sendToSockets('setClientPosition', {
          targets: 'byId',
          id: socketId,
          data: { clientIndexOnSide: index, clientCountOnSide: ar.length, clientIsMirrored: false }
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
