import * as dom from '../dom.mjs';
import * as events from '../events.mjs';

const { content } = document.getElementById('flash-layer');

window.customElements.define(
  'c-flash-layer',
  class extends HTMLElement {

    constructor () {
      super();

      this.index = 'flashLayer';
    }
    // static get observedAttributes() {
    //   return ['index'];
    // }

    // attributeChangedCallback(name, oldValue, newValue) {
    //   this.index = parseInt(newValue, 10);
    // }

    getLayerProperties() {
      return dom.getFormValues(this.formNode);
    }

    setLayerProperties(args) {
      if (args) {
        Object.keys(args).forEach(name => {
          this.formNode.querySelector(`[name=${name}]`).value = args[name];
        });
        this.formNode.dispatchEvent(new Event('submit'));
      }
    }

    connectedCallback() {
      if (this._domIitialised) {
        return;
      }
      this._domIitialised = true;

      this.appendChild(content.cloneNode(true));

      this.formNode = this.querySelector('form');

      this.formNode.addEventListener('submit', e => {
        e.preventDefault();

        const values = dom.getFormValues(e.target);

        events.trigger('setLayerProperties', {
          data: {
            index: this.index,
            properties: values
          }
        });

        const layerProperties = this.getLayerProperties();
        if (layerProperties) {
          localStorage.setItem(`layerProperties-${this.index}`, JSON.stringify(layerProperties));
        } else {
          localStorage.removeItem(`layerProperties-${this.index}`);
        }
      });

      const stored = JSON.parse(localStorage.getItem(`layerProperties-${this.index}`));
      this.setLayerProperties(stored);
    }

    disconnectedCallback() {
      console.log('disconnected!');
    }

    adoptedCallback() {
      console.log('adopted!');
    }
  }
);


// export default class FlashLayer {
//   constructor(options) {
//     this.index = options.index;
//     this.node = document.createElement('div');
//     this.isEnabled = true;


//     this.formNode = node.querySelector('form');

//     this.formNode.addEventListener('submit', e => {
//       e.preventDefault();

//       const values = dom.getFormValues(e.target);

//       // console.log(values);

//       events.trigger('setLayerProperties', {
//         data: {
//           index: 'flashLayer',
//           properties: values
//         }
//       });

//       const layerProperties = this.getLayerProperties();
//       if (layerProperties) {
//         localStorage.setItem(`layerProperties-${this.index}`, JSON.stringify(layerProperties));
//       } else {
//         localStorage.removeItem(`layerProperties-${this.index}`);
//       }
//     });
//   }


// }
