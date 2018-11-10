import './c-layer.mjs';
import './c-flash-layer.mjs';
import * as events from '../events.mjs';
import { LAYER_COUNT } from '../../constants.mjs';

window.customElements.define(
  'c-layers',
  class extends HTMLElement {
    constructor() {
      super();
      this.layers = [];

      events.listen('toggleIsEnabled', ({ data: { index } }) => {
        this.layers[index].toggleIsEnabled();
      });

      events.listen('disableAllLayers', () => {
        this.layers.forEach(l => {
          l.disable && l.disable();
        });
      });

      events.listen('enableAllLayers', () => {
        this.layers.forEach(l => {
          l.enable && l.enable();
        });
      });

      events.listen('setAllClientLayersProperties', () => {
        this.layers.forEach(l => {
          l.setClientLayerProperties && l.setClientLayerProperties();
        });
      });
    }

    connectedCallback() {
      console.log('Layers connected!');
      let index = 0;
      while (index <= LAYER_COUNT) {
        const layer = document.createElement('c-layer');
        layer.setAttribute('index', index);
        this.layers.push(layer);
        this.appendChild(layer);
        index++;
      }

      const layer = document.createElement('c-flash-layer');
      layer.setAttribute('index', index);
      this.layers.push(layer);
      this.appendChild(layer);
    }

    disconnectedCallback() {
      console.log('Layers disconnected!');
    }

    attributeChangedCallback(name, oldValue, newValue) {
      console.log(name, oldValue, newValue);
      this.index = newValue;
    }

    adoptedCallback() {
      console.log('Layers adopted!');
    }
  }
);
