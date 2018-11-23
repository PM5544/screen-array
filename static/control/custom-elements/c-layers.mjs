import './c-layer.mjs';
import './c-flash-layer.mjs';
import * as events from '../events.mjs';
import { LAYER_COUNT } from '../../constants.mjs';

const styleContent = `
:host {
  display: flex;
  padding: 0 var(--padding);
}
c-layer, c-flash-layer {
  border: 1px solid var(--border-color);
}
c-layer + c-layer,
c-layer + c-flash-layer {
  border-left-width: 0;
}
c-layer {
  flex: 2;
}
c-flash-layer {
  flex: 1;
}
`;

window.customElements.define(
  'c-layers',
  class extends HTMLElement {
    constructor() {
      super();

      this.layers = [];
      this.attachShadow({ mode: 'open' });

      {
        const styles = document.createElement('style');
        styles.textContent = styleContent;
        this.shadowRoot.appendChild(styles);
      }

      {
        let index = 0;
        while (index <= LAYER_COUNT) {
          const layer = document.createElement('c-layer');
          layer.setAttribute('index', index);
          this.layers.push(layer);
          this.shadowRoot.appendChild(layer);
          index++;
        }

        const layer = document.createElement('c-flash-layer');
        layer.setAttribute('index', index);
        this.layers.push(layer);
        this.shadowRoot.appendChild(layer);
      }

      events.listen('toggleIsEnabled', ({ data: { index } }) => {
        this.layers[index].toggleIsEnabled();
      });

      events.listen('disableAllLayers', () => {
        this.layers.forEach(l => {
          if ('isEnabled' in l) {
            l.isEnabled = false;
          }
        });
      });

      events.listen('enableAllLayers', () => {
        this.layers.forEach(l => {
          if ('isEnabled' in l) {
            l.isEnabled = true;
          }
        });
      });

      events.listen('setAllClientLayersProperties', () => {
        this.layers.forEach(l => {
          l.setClientLayerProperties && l.setClientLayerProperties();
        });
      });

      events.listen('loadAnimationIntoControlLayer', ({ data: { index } }) => {
        this.layers[index].selectAnimation();
      });
    }
  }
);
