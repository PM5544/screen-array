import * as dom from './dom.mjs';
import Layer from './Layer.mjs';
import FlashLayer from './FlashLayer.mjs';
import * as events from './events.mjs';

// the collection of all layers which are rendered each frame on the canvas
let layers = [];
const layerNode = dom.qSelect('[data-container=layers');

let index = 0;
while (index <= 6) {
  const layer = new Layer({ index });
  layers.push(layer);
  layerNode.appendChild(layer.node);

  index++;
}
const flashLayerIndex = index;

Array.from(layerNode.childNodes).forEach((node, index) => {
  node.addEventListener('mouseenter', function() {
    events.trigger('focusLayer', {
      index
    });
  });
  node.addEventListener('mouseleave', function() {
    events.trigger('unfocusLayer', {
      index
    });
  });
});

const flashLayer = new FlashLayer({ index });
layerNode.appendChild(flashLayer.node);

export function getControlParameters() {
  return layers.map(l => l.getControlParameters()).concat(flashLayer.getControlParameters());
}
export function setControlParameters(controlParameters) {
  layers.forEach((l, i) => {
    l.setControlParameters(controlParameters[i]);
  });
  flashLayer.setControlParameters(controlParameters[flashLayerIndex]);
}
export function setAllClientLayers() {
  layers.forEach(l => {
    l.setAllClientLayers();
  });
}
// export function reset(layerIndex) {
//   layers[layerIndex].reset();
// }

// export function remove(index) {
//   const layer = layers[index];
//   if (layer) {
//     layer.remove();
//     layers.splice(index, 1);
//   }
// }

// export function reorder(fromIndex, toIndex) {
//   const reordered = layers[fromIndex];
//   layers[fromIndex] = undefined;

//   layers.splice(toIndex, 1, reordered);
//   layers = layers.filter(v => !!v);
// }

events.listen('toggleIsEnabled', function({ data: { index } }) {
  layers[index].toggleIsEnabled();
});

events.listen('disableAll', function() {
  layers.forEach(l => {
    l.disable();
  });
});
events.listen('enableAll', function() {
  layers.forEach(l => {
    l.enable();
  });
});

export default layers;
