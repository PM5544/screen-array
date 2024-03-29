import { control } from '../socket.mjs';
import { CLIENT_COUNT } from '../../constants.mjs';

const styleContent = `
:host {
  display: flex;
  margin: 0 var(--padding);
  padding: var(--padding);
  border: 1px solid var(--border-color);
  cursor: pointer;
  min-width: 120px;
}
:host > div {
  margin: 0 2px;
  flex: 1;
  border: 1px solid var(--border-color);
  background: var(--enabled-color);
}
:host > div.left + :host > div.right {
  margin-left: 10px;
}
`;

window.customElements.define(
  'c-client-statuses',
  class extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });

      const styles = document.createElement('style');
      styles.textContent = styleContent;
      this.shadowRoot.appendChild(styles);

      this.addEventListener('click', ({ target }) => {
        control.emit('sendAllClientIds');
      }, false);

      this.shadowRoot.addEventListener('click', e => {
        e.preventDefault();
        const { target } = e;
        const { id } = target.dataset;
        if (id) {
          control.emit('identify', {
            targets: 'byId',
            id,
            data: { id: id.replace('/clients#', '') }
          });
        }
      }, false);

      control.on('allClientIds', data => {
        Array.from(this.shadowRoot.querySelectorAll('div')).map(n => {
          n.parentNode.removeChild(n);
        });

        ['left', 'right'].forEach(side => {
          data[side].forEach(id => {
            const clientIndicator = document.createElement('div');
            clientIndicator.className = side;
            clientIndicator.dataset.id = id;
            this.shadowRoot.appendChild(clientIndicator);
          });
        });
      });
    }
  }
);
