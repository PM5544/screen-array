import Layer from './Layer.mjs';
import Flash from '../animations/Flash.mjs';

const maxLayers = 7;
// the collection of all layers which are rendered each frame on the canvas
const layers = [];

{
  let index = 0;
  while (index < maxLayers) {
    const layer = new Layer({ index });
    layers.push(layer);
    index++;
  }
}

export const flashLayer = new Layer();
flashLayer.setAnimation(Flash, true);
// export function add(index = layers.length) {
//   const layer = new Layer();

//   if (index >= layers.length) {
//     layers.push(layer);
//   } else {
//     layers.splice(index, 1, layer);
//   }
// }
export function flashOn() {
  this.flashLayer.enable();
}
export function flashOff() {
  this.flashLayer.disable();
}

export function disable({ index }) {
  layers[index].disable();
}
export function enable({ index }) {
  layers[index].enable();
}

export function disableAll() {
  layers.forEach(l => {
    l.disable();
  });
}
export function enableAll() {
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

export function setParameters({ index, parameters }) {
  if ('flashLayer' === index) {
    flashLayer.setParameters(parameters);
  } else {
    layers[index].setParameters(parameters);
  }
}

export function restartAnimation({ index }) {
  layers[index].restart();
}

export function loadAnimation(args) {
  const { index } = args;
  layers[index].load(args);
}

export function setClientPosition(args) {
  layers.forEach(l => {
    l.setClientPosition(args);
  });
}

export function setControlParameters(args) {
  args.forEach((arg, i) => {
    if (arg) {
      layers[i].setParameters(arg);
    }
  });
}

export default layers;
