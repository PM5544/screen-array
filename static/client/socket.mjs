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
  'disableLayer',
  'disableAllLayers',
  'enableLayer',
  'enableAllLayers',
  'flashOn',
  'flashOff',
  'restartAnimation',
  'setClientPosition',
].forEach(type => {
  clients.on(type, args => {
    layers[type](args);
  });
});
['loadAnimation', 'setLayerProperties'].forEach(type => {
  clients.on(type, args => {
    const {
      properties: { color }
    } = args;
    if (color) {
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      delete args.properties.color;
      Object.assign(args.properties, { r, g, b });
    }
    layers[type](args);
  });
});

const clientPosition = localStorage.getItem('clientPosition');
clients.on('getClientPosition', () => {
  clients.emit('setClientPosition', { clientPosition });
});
clients.on('setClientPosition', function({ clientPosition }) {
  if (clientPosition) {
    localStorage.setItem('clientPosition', clientPosition);
  }
  overlay(clientPosition);
});

clients.on('identify', function(data) {
  overlay(data.id);
});

clients.on('audioSpectrumValues', function(data) {
  setAudioLevels(data);
});
