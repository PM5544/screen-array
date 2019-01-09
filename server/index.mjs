import { IO, controlServer, clientsServer } from './io';
import * as registeredSockets from './registeredSockets.mjs';
import * as storage from './storage.mjs';
import server from './server.mjs';
import sendToSockets from './sendToSockets.mjs';
import getAllAnimationsPaths from './getAllAnimationsPaths.mjs';
import './audio';

IO.attach(server, {
  transports: ['websocket']
});

controlServer.on('connection', function(co) {
  registeredSockets.set('control', co.id);

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
    'setLayerProperties',
    'setClientPosition'
  ].forEach(type => {
    co.on(type, function(instructions) {
      // console.log(type, instructions);
      sendToSockets(type, instructions);
    });
  });

  co.on('retrieve', async function(path) {
    // console.log('retrieving:', path);
    co.emit('retrieved', await storage.retrieve(path));
  });

  co.on('persist', async function(ob) {
    // console.log('persisting', ob.data, 'to', ob.path);
    co.emit('persisted', await storage.persist(ob));
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

      console.log(clientIds, registeredSockets.controlSocketId);

      co.emit('allClientIds', {
        clientIds,
        registered,
        left: registeredSockets.socketsLeftValues,
        right: registeredSockets.socketsRightValues
      });

      registeredSockets.socketsLeftValues.forEach((socketId, index, ar) => {
        // console.log(socketId, index, ar.length, true );
        sendToSockets('setClientPositionProperties', {
          targets: 'byId',
          id: socketId,
          data: { clientIndexOnSide: index, clientCountOnSide: ar.length, clientIsMirrored: true }
        });
      });
      registeredSockets.socketsRightValues.forEach((socketId, index, ar) => {
        // console.log(socketId, index, ar.length, false );
        sendToSockets('setClientPositionProperties', {
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
  cl.on('setClientPosition', function({ clientPosition }) {
    console.log(clientPosition, cl.id);
    registeredSockets.set(clientPosition, cl.id);
  });
  cl.emit('getClientPosition');
});
clientsServer.on('reconnect', function(cl) {
  cl.emit('getClientPosition');
});

server.listen(1337);
