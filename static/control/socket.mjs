/* globals io */
import * as events from './events.mjs';

io({ transports: ['websocket'] });

export const control = io('/control');

control.on('clientError', data => {
  document.querySelector('div').style.background = '#ff0000';
  console.error(JSON.parse(data));
});

[
  'blackOutOff',
  'blackOutOn',
  'disableLayer',
  'enableLayer',
  'flashOff',
  'flashOn',
  'loadAnimation',
  'restartAnimation',
  'setLayerProperties'
].forEach(type => {
  events.listen(type, function(payload) {
    control.emit(type, payload);
  });
});

control.on('getLayerProperties', ({ id }) => {
  const layers = document.querySelector('c-layers').layers;
  control.emit('setLayerProperties', {
    targets: 'byId',
    id,
    data: layers.map(l => l.getLayerProperties())
  });
});
