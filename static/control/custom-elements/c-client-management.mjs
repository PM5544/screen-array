import templateLoader from '../../utils/template-loader.mjs';
import { CLIENT_COUNT } from '../../constants.mjs';
import { control } from '../socket.mjs';
import { empty, NodesProxy } from '../dom.mjs';

const name = 'c-client-management';

templateLoader(name).then(content => {
  window.customElements.define(
    name,
    class extends HTMLElement {
      get name() {
        return 'Client management';
      }

      constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.shadowRoot.appendChild(content.cloneNode(true));

        this.nodes = new NodesProxy(this.shadowRoot);

        this.shadowRoot.addEventListener('focus', this, true);
        this.shadowRoot.addEventListener('blur', this, true);
        this.shadowRoot.addEventListener('click', this, true);

        control.on('allClientIds', this.populate.bind(this));
      }

      handleEvent({ type, target }) {
        switch (type) {
          case 'click':
            if (target.nodeName === 'BUTTON') {
              control.emit('sendAllClientIds');
            }
            break;

          case 'blur':
            {
              const { value } = target;
              const { id } = target.dataset;
              if (typeof value !== 'undefined' && value !== '') {
                control.emit('setClientPosition', {
                  id,
                  targets: 'byId',
                  data: {
                    clientPosition: parseInt(value, 10)
                  }
                });
              }
            }
            break;

          case 'focus':
            {
              const { id } = target.dataset;
              control.emit('identify', { targets: 'byId', id, data: { id } });
            }
            break;
        }
      }

      populate({ clientIds }) {
        empty(this.nodes.clients);

        clientIds.sort().forEach(id => {
          const i = document.createElement('input');
          i.type = 'number';
          i.step = '1';
          i.min = '1';
          i.max = CLIENT_COUNT;
          i.dataset.id = id;

          this.nodes.clients.appendChild(i);
        });
      }

      connectedCallback() {
        control.emit('sendAllClientIds');
      }
    }
  );
});
