import { IO, controlServer, clientsServer } from './io';
import * as registeredSockets from './registeredSockets';
import server from './server';
import sendToSockets from './sendToSockets';
import getAllAnimationsPaths from './getAllAnimationsPaths';

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

// // Create a new instance of node-core-audio
// var readAudio from 'read-audio');

// var pull from 'pull-stream');
// // var terminalBar from 'terminal-bar');
// var ft from 'fourier-transform');
// var db from 'decibels');

// var audio = readAudio({
//   buffer: 1024,
//   inFile: '-d', // '-d' is default device
//   channels: 1,
//   rate: 44100,
//   dtype: 'int32',
//   // int8, uint8, int16, uint16,
//   // int32, uint32, float32, float64
//   // also supported
//   soxPath: 'sox'
// });

// let through = 0;
// const oneIn = 50;
// pull(
//   audio,
//   pull.map(function(arr, enc, cb) {
//     // console.log(arr.data.length);
//     // return arr.data;
//     return [].slice.call(arr.data, 0, 256);
//   }),
//   pull.drain(function(data) {
//     // console.log(data.length);
//     var spectrum = ft(data);
//     // console.log(spectrum);
//     if (through === oneIn) {
//       var decibels = spectrum.map(value => (db.fromGain(value) + 100) / 100);
//       io.of('clients').emit('data', { data: decibels });
//       through = 0;
//     } else {
//       through++;
//     }
//   })
// );

// let last = new Date();

// function getLevels() {
//   const ar = [];
//   for (let i = 12; i > 0; i--) {
//     let _level = level;
//     _level += i * 0.01;
//     if (_level > 1) {
//       _level -= 1;
//     }
//     ar.push(_level);
//   }

//   return ar;
// }

// let level = 0;
// setInterval(() => {
//   const now = new Date();
//   //   console.log(Math.round(1000 / (now - last)));
//   last = now;
//   const data = {
//     data: getLevels()
//   };

//   sendToSockets('levels', { to: 'clients', data });

//   level += 0.1;

//   if (level > 1) {
//     level = 0;
//   }
// }, 1000 / 30);

server.listen(1337);
