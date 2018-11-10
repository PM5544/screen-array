import * as events from '../events.mjs';

const styleContent = `
:host {
  display: grid;
}
`;

window.customElements.define(
  'c-animations-explorer',
  class extends HTMLElement {
    constructor() {
      super();

      this._shadowRoot = this.attachShadow({ mode: 'open' });

      const styles = document.createElement('style');
      styles.textContent = styleContent;
      this._shadowRoot.appendChild(styles);
    }

    connectedCallback() {
      console.log('Layers connected!');
    }

    disconnectedCallback() {
      console.log('Layers disconnected!');
    }

    // attributeChangedCallback(name, oldValue, newValue) {
    //   console.log(name, oldValue, newValue);
    // }

    adoptedCallback() {
      console.log('Layers adopted!');
    }
  }
);
