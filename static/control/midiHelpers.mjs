import * as events from './events.mjs';
import './custom-elements/c-layer.mjs';
import './custom-elements/c-layers.mjs';
import './custom-elements/c-flash-layer.mjs';

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

const layersNode = document.querySelector('c-layers');

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

function restoreMidiLayerIndicators(index, port) {
  if (index === 7) {
    let counter = 63;
    while (counter >= 0) {
      if (hasKeyMapping(counter)) {
        port.send([NOTE_ON, counter, LIGHT_GREEN]);
      }
      counter -= 8;
    }
  } else if (layersNode.layers[index].isEnabled) {
    let counter = index;
    while (counter < 64) {
      if (hasKeyMapping(counter)) {
        port.send([NOTE_ON, counter, LIGHT_GREEN]);
      } else {
        port.send([NOTE_ON, counter, LIGHT_OFF]);
      }
      counter += 8;
    }
  } else {
    let counter = index;
    while (counter < 64) {
      port.send([NOTE_ON, counter, LIGHT_OFF]);
      counter += 8;
    }
  }
}

export function addOutputEvents(port) {
  sayHi(port);

  return [
    events.listen('restoreMidi', function restoreMidi() {
      layersNode.layers.forEach((layer, index) => {
        if (layer.moduleSpecifier) {
          port.send([NOTE_ON, 64 + index, LIGHT_GREEN]);
          restoreMidiLayerIndicators(index, port);

          // if (layer.isEnabled) {
          //   let counter = 56;
          //   while (counter >= 0) {
          //     if (hasKeyMapping(counter)) {
          //       port.send([NOTE_ON, counter + index, LIGHT_GREEN]);
          //     }
          //     counter -= 8;
          //   }
          // }
        }
      });
    }),
    events.listen('enableMidiLayerToggle', function enableMidiLayerToggle({ data: { index } }) {
      if (layersNode.layers[index].moduleSpecifier) {
        port.send([NOTE_ON, 64 + index, LIGHT_GREEN]);
      }
    }),
    events.listen('disableMidiLayerToggle', function disableMidiLayerToggle({ data: { index } }) {
      if (layersNode.layers[index].moduleSpecifier) {
        port.send([NOTE_ON, 64 + index, LIGHT_OFF]);
      }
    }),
    events.listen('enableLayer', function enableLayerByMidi({ data: { index } }) {
      if (layersNode.layers[index].moduleSpecifier) {
        let counter = 56;
        while (counter >= 0) {
          if (hasKeyMapping(counter)) {
            port.send([NOTE_ON, counter + index, LIGHT_GREEN]);
          }
          counter -= 8;
        }
      }
    }),
    events.listen('disableLayer', function disableLayerByMidi({ data: { index } }) {
      if (layersNode.layers[index].moduleSpecifier) {
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
      const layer = layersNode.layers[index];
      if (layer.isEnabled) {
        if (hasKeyMapping(0 + index)) {
          port.send([NOTE_ON, 0 + index, LIGHT_GREEN]);
        } else {
          port.send([NOTE_ON, 0 + index, LIGHT_OFF]);
        }
      } else {
        port.send([NOTE_ON, 0 + index, LIGHT_OFF]);
      }
    }),
    document.documentElement.addEventListener('selectedAnimationToLoad', function highlightLoadButtons() {
      let counter = 7;
      while (counter--) {
        port.send([NOTE_ON, counter, LIGHT_YELLOW_BLINK]);
      }
    }),
    document.documentElement.addEventListener('loadedAnimationIntoLayer', function restoreAllLayersMidiIndicators() {
      let counter = 7;
      while (counter--) {
        restoreMidiLayerIndicators(counter, port);
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
    setTimeout(() => {
      // also highlight the midi buttons that are active for the flashLayer
      restoreMidiLayerIndicators(7, port);
    }, 0);
  }
}
