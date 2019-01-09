import templateLoader from '../../utils/template-loader.mjs';
import { NodesProxy } from '../dom.mjs';
import './c-layer.mjs';
import './c-flash-layer.mjs';
import * as events from '../events.mjs';

const name = 'c-layers';

templateLoader(name).then(content => {
  window.customElements.define(
    name,
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

      get previewIsEnabled() {
        return this._previewIsEnabled;
      }
      set previewIsEnabled(v = false) {
        if (typeof v !== 'boolean') {
          throw new Error(`usupported type ${typeof v}, expected boolean`);
        }
        this._previewIsEnabled = v;

        console.log(this.previewIsEnabled);
      }

      constructor() {
        super();

        this.layers = [];
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(content.cloneNode(true));

        this.nodes = new NodesProxy(this.shadowRoot);

        const b = document.createElement('button', { is: 'c-toggle-button' });
        b.innerText = 'previews';
        b.handler = bool => this.previewIsEnabled = bool;
        this.nodes.buttons.appendChild(b);

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

      connectedCallback() {
        this.layers = Array.from(this.querySelectorAll('c-layer'));
      }
    }
  );
});
