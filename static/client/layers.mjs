import Layer from './Layer.mjs';
import Flash from '../animations/Flash.mjs';
import { LAYER_COUNT } from '../constants.mjs';

// the collection of all layers which are rendered each frame on the canvas
export const layers = [];

{
  let index = 0;
  while (index <= LAYER_COUNT) {
    const layer = new Layer({ index });
    layers.push(layer);
    index++;
  }
}

export const flashLayer = new Layer();
flashLayer.setAnimation(Flash, true);

export function flashOn() {
  this.flashLayer.enable();
}
export function flashOff() {
  this.flashLayer.disable();
}

export function disableLayer({ index }) {
  layers[index] && layers[index].disable();
}
export function enableLayer({ index }) {
  layers[index] && layers[index].enable();
}

export function disableAllLayers() {
  layers.forEach(l => {
    l.disable();
  });
}
export function enableAllLayers() {
  layers.forEach(l => {
    l.enable();
  });
}

export function blackOutOn() {
  layers.forEach(l => {
    l.blackOutOn();
  });
}
export function blackOutOff() {
  layers.forEach(l => {
    l.blackOutOff();
  });
}

export function clearLayer({ index }) {
  layers[index].clear();
}

export function restartAnimation({ index }) {
  layers[index].restart();
}

export function loadAnimation(args) {
  const { index } = args;
  layers[index].load(args);
}

export function setClientPositionProperties(args) {
  layers.forEach(l => {
    l.setClientPositionProperties(args);
  });
}

export function setLayerProperties({index, properties}) {
  console.log('setLayerProperties called', index, properties);
  if ('flashLayer' === index) {
    flashLayer.setProperties(properties);
  } else {
    layers[index].setProperties(properties);
  }
}
