/* globals io */
import { qSelect } from './dom.mjs';
import { getControlParameters } from './layers.mjs';
import * as events from './events.mjs';

io({ transports: ['websocket'] });

export const clients = io('/clients');
export const control = io('/control');

control.on('clientError', data => {
  qSelect('div').style.background = '#ff0000';
  console.error(JSON.parse(data));
});

[
  'blackOutOff',
  'blackOutOn',
  'disable',
  'enable',
  'flashOn',
  'flashOff',
  'loadAnimation',
  'setParameters',
  'restartAnimation'
].forEach(type => {
  events.listen(type, function(payload) {
    control.emit(type, payload);
  });
});

control.on('getControlParameters', ({ id }) => {
  control.emit('setControlParameters', {
    targets: 'byId',
    id,
    data: getControlParameters()
  });
});
