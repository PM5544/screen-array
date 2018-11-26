import templateLoader from '../../utils/template-loader.mjs';

const name = 'c-tabs';
const selectedTabButtonClassName = 'selected-tab-button';

templateLoader(name).then(content => {
  window.customElements.define(
    name,
    class extends HTMLElement {
      constructor() {
        super();

        this.tabs = new Map();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(content.cloneNode(true));
      }

      handleEvent({ type, target }) {
        if (type === 'click' && target.nodeName === 'BUTTON') {
          this.tabs.forEach((tab, button) => {
            if (button === target) {
              tab.removeAttribute('hidden');
              button.classList.add(selectedTabButtonClassName);
            } else {
              tab.setAttribute('hidden', '');
              button.classList.remove(selectedTabButtonClassName);
            }
          });
        }
      }

      resize() {
        this.tabContainerNode.style.height = `${window.innerHeight -
          this.tabContainerNode.offsetTop -
          10}px`;
      }

      connectedCallback() {
        this.buttonContainer = this.shadowRoot.querySelector('div');
        Array.from(this.querySelectorAll('[data-tab]')).forEach((node, index) => {
          const { tab } = node.dataset;

          const b = document.createElement('button');
          b.innerText = tab;
          b.slot = 'buttons';

          this.tabs.set(b, node);
          this.buttonContainer.appendChild(b);

          if (index === 0) {
            b.classList.add(selectedTabButtonClassName);
          } else {
            node.setAttribute('hidden', '');
          }
        });

        this.buttonContainer.addEventListener('click', this, true);

        this.tabContainerNode = this.shadowRoot.querySelector('section');

        new ResizeObserver(entries => {
          for (let entry of entries) {
            this.resize();
          }
        }).observe(document.body);

        this.resize();
      }
    }
  );
});

// const { content } = document.getElementById('tabs');
