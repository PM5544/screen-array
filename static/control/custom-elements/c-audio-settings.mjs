import templateLoader from '../../utils/template-loader.mjs';
import { NodesProxy } from '../dom.mjs';
import { control } from '../socket.mjs';

const name = 'c-audio-settings';

control.on('retrieved', function (ob) {
  console.log(ob);
});
control.on('persisted', function (ob) {
  console.log(ob);
});

templateLoader(name).then(content => {
  window.customElements.define(
    name,
    class extends HTMLElement {
      get name() {
        return 'Audio settings';
      }

      constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(content.cloneNode(true));
        this.nodes = new NodesProxy(this.shadowRoot);

        control.emit('retrieve', {
          // path: 'iets',
          // data: { blaat: { iets: { nogiets: { e: 'pers', f: 'fafdf', r: 23 } } } }
          path: 'iets'
        });

        // control.emit('persist', {
        //   path: 'iets',
        //   data: { opgeslage: 'stringy', blaat: 'poep',2: 3 }
        // });

        // window.setTimeout(() => {
        //   control.emit('persist', {
        //     path: 'iets',
        //     data: { opgeslagen: 'stringy' }
        //     // path: 'iets'
        //   });
        // }, 1000);
      }
    }
  );
});
