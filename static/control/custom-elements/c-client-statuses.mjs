import { control } from '../socket.mjs';

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

      this.shadowRoot.addEventListener('click', ({ target }) => {
        const { id } = target.dataset;
        if (id) {
          control.emit('identify', {
            targets: 'byId',
            id,
            data: { id: id.replace('/clients#', '') }
          });
        } else {
          control.emit('sendAllClientIds');
        }
      });

      control.on('allClientIds', data => {
        console.log(data);

        Array.from(this.shadowRoot.querySelectorAll('div')).forEach(n => {
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

    connectedCallback() {
      control.emit('sendAllClientIds');
    }

    disconnectedCallback() {
      console.log('disconnected!');
    }

    adoptedCallback() {
      console.log('adopted!');
    }
  }
);
