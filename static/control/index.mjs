import './custom-elements/c-layers.mjs';
import './custom-elements/c-full-screen-toggle.mjs';
import './custom-elements/c-beat-indicator.mjs';
import './custom-elements/c-client-statuses.mjs';
import './custom-elements/c-animations-explorer.mjs';
import './custom-elements/c-client-management.mjs';
import './custom-elements/c-tabs.mjs';
import './midi.mjs';
import * as events from './events.mjs';
import { control } from './socket.mjs';
import './animations.mjs';

document.querySelector('[data-action="refresh"]').addEventListener('click', e => {
  e.preventDefault();
  control.emit('refresh');
  setTimeout(() => {
    control.emit('sendAllClientIds');
  }, 2000);
});

document.querySelector('[data-action="setAllLayers"]').addEventListener('click', e => {
  e.preventDefault();
  events.trigger('setAllClientLayersProperties');
});

document.documentElement.addEventListener('keydown', ({ which }) => {
  switch (which) {
    case 32:
    events.trigger('beatSyncRestart');
  }
});
