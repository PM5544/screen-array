/* globals io */
import * as layers from './layers.mjs';
import { setAudioLevels } from './draw.mjs';
import { overlay, reload } from './dom.mjs';

io({ transports: ['websocket'] });

export const clients = io('/clients');

clients.on('refresh', function() {
  reload();
});

[
  'blackOutOff',
  'blackOutOn',
  'clearLayer',
  'disable',
  'disableAll',
  'enable',
  'enableAll',
  'flashOn',
  'flashOff',

  'restartAnimation',
  'setClientPosition',
  'setControlParameters'
].forEach(type => {
  clients.on(type, args => {
    layers[type](args);
  });
});
['loadAnimation', 'setParameters'].forEach(type => {
  clients.on(type, args => {
    const {
      parameters: { color }
    } = args;
    if (color) {
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      delete args.parameters.color;
      Object.assign(args.parameters, { r, g, b });
    }
    layers[type](args);
  });
});
// clients.on(, args => {
//   const {
//     parameters: { color }
//   } = args;
//   if (color) {
//     const r = parseInt(color.substr(1, 2), 16);
//     const g = parseInt(color.substr(3, 2), 16);
//     const b = parseInt(color.substr(5, 2), 16);
//     delete args.parameters.color;
//     Object.assign(args.parameters, { r, g, b });
//   }
//   layers.setParameters(args);
// });

const socketNumber = localStorage.getItem('socketNumber');
clients.on('getSocketNumber', () => {
  clients.emit('setSocketNumber', { socketNumber });
});
clients.on('setSocketNumber', function(data) {
  const { socketNumber } = data;
  if (socketNumber) {
    localStorage.setItem('socketNumber', data.socketNumber);
  }
  overlay(socketNumber);
});

clients.on('identify', function(data) {
  overlay(data.id);
});

clients.on('levels', function(data) {
  setAudioLevels(data);
});
