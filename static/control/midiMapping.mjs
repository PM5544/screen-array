import * as events from './events.mjs';

const eventsTearDown = [];
const mappingFile = fetch('midi-mapping.json')
  .then(r => r.json())
  .catch(err => {
    console.error(err);
    return {};
  });

const controlsOn = new Map();
const controlsOff = new Map();
const controlsValue = new Map();

const variants = { on: controlsOn, off: controlsOff, value: controlsValue };

const foundMidiMappings = new Map();
export function hasKeyMapping(id, type = 'on') {
  return foundMidiMappings.has(id) && foundMidiMappings.get(id).includes(type);
}

export function setup() {
  mappingFile.then(mapping => {
    Object.keys(mapping).forEach(id => {
      const instruction = mapping[id];

      const foundMidiInstructions = [];

      Object.keys(variants).forEach(variant => {
        foundMidiInstructions.push(variant);
        if (instruction[variant]) {
          if ('value' === variant) {
            const { payload, command, property, targets } = instruction[variant];
            variants[variant].set(parseInt(id, 10), value => {
              payload.properties = { [property]: value };
              events.trigger(command, {
                targets,
                data: payload
              });
            });
          } else {
            const { payload, command, targets } = instruction[variant];
            variants[variant].set(parseInt(id, 10), () => {
              events.trigger(command, { targets, data: payload || {} });
            });
          }
        }
      });

      foundMidiMappings.set(parseInt(id, 10), foundMidiInstructions);
    });

    eventsTearDown.push(
      events.listen('midi-note-on', function midiNoteOn({ key }) {
        // console.log('on', key);
        if (controlsOn.has(key)) {
          controlsOn.get(key)();
        }
      })
    );

    eventsTearDown.push(
      events.listen('midi-note-off', function midiNoteOff({ key }) {
        // console.log('off', key);
        if (controlsOff.has(key)) {
          controlsOff.get(key)();
        }
      })
    );
    eventsTearDown.push(
      events.listen('midi-value', function midiValue({ key, value }) {
        // console.log('value', key, value);
        if (controlsValue.has(key)) {
          controlsValue.get(key)(value);
        }
      })
    );
  });

  // eventsTearDown.push(
  //   events.listen('disableLayer', function({ data: { index } }) {
  //     outputs.send([NOTE_ON, 56 + index, 0]);
  //   })
  // );
}

export function tearDown() {}
