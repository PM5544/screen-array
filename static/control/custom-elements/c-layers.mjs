import './c-layer.mjs';
import './c-flash-layer.mjs';
import * as events from '../events.mjs';

const { content } = document.getElementById('layers');

window.customElements.define(
  'c-layers',
  class extends HTMLElement {

    get isEnabled() {
      return this._isEnabled;
    }
    set isEnabled(v = false) {
      if (typeof v !== 'boolean') {
        throw new Error(`usupported type ${typeof v}, expected boolean`);
      }

      this._isEnabled = v;

      this.layers.forEach(l => {
        if ('isEnabled' in l) {
          l.isEnabled = this._isEnabled;
        }
      });
    }

    constructor() {
      super();

      this.layers = [];
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(content.cloneNode(true));

      const b = document.createElement('button', { is: 'c-toggle-button' });
      b.innerText = 'nieuwe button';
      b.slot = 'buttons';

      this.appendChild(b);

      events.listen('toggleIsEnabled', ({ data: { index } }) => {
        this.layers[index].toggleIsEnabled();
      });

      events.listen('disableAllLayers', () => {
        this.isEnabled = false;
      });

      events.listen('enableAllLayers', () => {
        this.isEnabled = true;
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

    connectedCallback () {
      this.layers = Array.from(this.querySelectorAll('c-layer'));
    }
  }
);
