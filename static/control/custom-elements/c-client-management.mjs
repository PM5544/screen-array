/* globals io */
import { LAYER_COUNT } from '../../constants.mjs';
import { empty } from '../dom.mjs';

io({ transports: ['websocket'] });
const socket = io('/control');

const styleContent = `
:host {
  padding: 3rem;
}
button {
  display: block;
  margin: 0 auto;
}
div {
  display: flex;
  justify-content: center;
}
input[type=number] {
  -webkit-appearance: none;
  border: 1px solid grey;
  border-radius: 2px;
  display: inline-block;
  width: 3em;
  height: 2em;
  margin: .3rem;
  background: white;
}`;

window.customElements.define(
  'c-client-management',
  class extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });

      const styles = document.createElement('style');
      styles.textContent = styleContent;
      this.shadowRoot.appendChild(styles);

      const button = document.createElement('button');
      button.innerText = 'refresh';
      button.tabIndex = '-1';
      this.shadowRoot.appendChild(button);

      this.clients = document.createElement('div');
      this.shadowRoot.appendChild(this.clients);

      this.shadowRoot.addEventListener('focus', this, true);
      this.shadowRoot.addEventListener('blur', this, true);
      this.shadowRoot.addEventListener('click', this, true);

      socket.on('allClientIds', this.populate.bind(this));
    }

    handleEvent({ type, target }) {
      switch (type) {
        case 'click':
          if (target.nodeName === 'BUTTON') {
            socket.emit('sendAllClientIds');
          }
          break;

        case 'blur':
          {
            const { value } = target;
            const { id } = target.dataset;
            console.log(value);
            if (typeof value !== 'undefined' && value !== '') {
              socket.emit('setSocketNumber', {
                id,
                targets: 'byId',
                data: {
                  socketNumber: parseInt(value, 10)
                }
              });
            }
          }
          break;

        case 'focus':
          {
            const { id } = target.dataset;
            socket.emit('identify', { targets: 'byId', id, data: { id } });
          }
          break;
      }
    }

    populate(data) {
      empty(this.clients);

      data.clientIds.sort().forEach(id => {
        const i = document.createElement('input');
        i.type = 'number';
        i.step = '1';
        i.min = '0';
        i.max = LAYER_COUNT;
        i.dataset.id = id;

        this.clients.appendChild(i);
      });

      console.log(data.registered);
    }

    connectedCallback() {
      socket.emit('sendAllClientIds');
    }
  }
);
