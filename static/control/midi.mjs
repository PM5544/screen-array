import * as events from './events.mjs';
import * as midiMapping from './midiMapping.mjs';
import * as midiHelpers from './midiHelpers.mjs';

const registeredMidiPorts = new Map();

function handleMidiPortStateChange(port) {
  const { connection, id, manufacturer, name, onmidimessage, state, type, version } = port;

  // console.log(`${state} ${type} for ${manufacturer} ${name} with id:${id}`);

  if (state === 'connected') {
    if (registeredMidiPorts.has(id)) {
      return;
    }
    if (type === 'input') {
      port.addEventListener('midimessage', midiHelpers.handleMidiInputMessage);
      // console.log(`adding eventListener for midi input with id ${id}`);
      registeredMidiPorts.set(id, port);
    } else if (type === 'output') {
      registeredMidiPorts.set(id, midiHelpers.addOutputEvents(port));
      events.trigger('restoreMidi');
      // console.log(`setting up midi output for id ${id}`);
    }
  } else {
    if (!registeredMidiPorts.has(id)) {
      return;
    }
    if (type === 'input') {
      port.removeEventListener('midimessage', midiHelpers.handleMidiInputMessage);
      // console.log(`removing eventListener for midi input with id ${id}`);
      registeredMidiPorts.delete(id);
    } else if (type === 'output') {
      // console.log(`tearing down midi output for ${id}`);
      registeredMidiPorts.get(id).forEach(fn => {
        fn();
      });
      registeredMidiPorts.delete(id);
    }
  }
}

function setupMidi(midi) {
  Array.from(midi.inputs.values())
    .concat(Array.from(midi.outputs.values()))
    .forEach(port => {
      handleMidiPortStateChange(port, true);
    });

  midiMapping.setup();
}

navigator
  .requestMIDIAccess({ sysex: true })
  .then(midiAccess => {
    setupMidi(midiAccess);

    midiAccess.addEventListener('statechange', ({ port }) => {
      handleMidiPortStateChange(port);
    });
  })
  .catch(console.error);
