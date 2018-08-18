import * as events from './events.mjs';
import layers from './layers.mjs';
import { hasKeyMapping } from './midiMapping.mjs';
import {
  NOTE_OFF,
  NOTE_ON,
  CONTROL_CHANGE,
  LOW, // eslint-disable-line no-unused-vars
  HIGH,
  FACTOR,
  LIGHT_OFF,
  LIGHT_GREEN,
  LIGHT_GREEN_BLINK, // eslint-disable-line no-unused-vars
  LIGHT_RED, // eslint-disable-line no-unused-vars
  LIGHT_RED_BLINK, // eslint-disable-line no-unused-vars
  LIGHT_YELLOW, // eslint-disable-line no-unused-vars
  LIGHT_YELLOW_BLINK
} from '../constants.mjs';

export function handleMidiInputMessage({ data: [ctrl, key, value] }) {
  // console.log(ctrl, key, value);
  switch (ctrl) {
    case NOTE_ON:
      events.trigger('midi-note-on', { key });
      break;

    case NOTE_OFF:
      events.trigger('midi-note-off', { key });
      break;

    case CONTROL_CHANGE:
      {
        const normalisedValue = Math.round((value / HIGH) * FACTOR) / FACTOR;
        events.trigger('midi-value', { key, value: normalisedValue });
      }
      break;
  }
}

export function addOutputEvents(port) {
  sayHi(port);

  return [
    events.listen('restoreMidi', function restoreMidi() {
      layers.forEach((layer, index) => {
        if (layer.moduleId) {
          port.send([NOTE_ON, 64 + index, LIGHT_GREEN]);
          if (layer.isEnabled) {
            let counter = 56;
            while (counter >= 0) {
              if (hasKeyMapping(counter)) {
                port.send([NOTE_ON, counter + index, LIGHT_GREEN]);
              }
              counter -= 8;
            }
          }
        }
      });
    }),
    events.listen('enableLayerToggle', function enableLayerToggle({ data: { index } }) {
      if (layers[index].moduleId) {
        port.send([NOTE_ON, 64 + index, LIGHT_GREEN]);
      }
    }),
    events.listen('disableLayerToggle', function disableLayerToggle({ data: { index } }) {
      if (layers[index].moduleId) {
        port.send([NOTE_ON, 64 + index, LIGHT_OFF]);
      }
    }),
    events.listen('enable', function enableLayerByMidi({ data: { index } }) {
      if (layers[index].moduleId) {
        let counter = 56;
        while (counter >= 0) {
          if (hasKeyMapping(counter)) {
            port.send([NOTE_ON, counter + index, LIGHT_GREEN]);
          }
          counter -= 8;
        }
      }
    }),
    events.listen('disable', function disableLayerByMidi({ data: { index } }) {
      if (layers[index].moduleId) {
        let counter = 56;
        while (counter >= 0) {
          port.send([NOTE_ON, counter + index, LIGHT_OFF]);
          counter -= 8;
        }
      }
    }),
    events.listen('focusLayer', function highlighFocussedLayer({ index }) {
      port.send([NOTE_ON, 0 + index, LIGHT_YELLOW_BLINK]);
    }),
    events.listen('unfocusLayer', function unhighlighFocussedLayer({ index }) {
      const layer = layers[index];
      if (layer.isEnabled) {
        if (hasKeyMapping(0 + index)) {
          port.send([NOTE_ON, 0 + index, LIGHT_GREEN]);
        } else {
          port.send([NOTE_ON, 0 + index, LIGHT_OFF]);
        }
      } else {
        port.send([NOTE_ON, 0 + index, LIGHT_OFF]);
      }
    })
  ];
}

export function sayHi(port) {
  {
    let counter = 0;
    while (counter <= 8) {
      const midiNum = 82 + counter;
      setTimeout(() => {
        port.send([NOTE_ON, midiNum, LIGHT_GREEN]);
      }, counter * 50);
      setTimeout(() => {
        port.send([NOTE_ON, midiNum, LIGHT_OFF]);
      }, 1000 - counter * 50);
      counter += 1;
    }
  }
  {
    let counter = 63;
    while (counter >= 0) {
      if (hasKeyMapping(counter)) {
        port.send([NOTE_ON, counter, LIGHT_GREEN]);
      }
      counter -= 8;
    }
  }
}
