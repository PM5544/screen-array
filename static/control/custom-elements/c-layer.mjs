import { empty, getFormValues, NodesProxy, ActionsProxy } from '../dom.mjs';
import * as events from '../events.mjs';
import * as propertyTypes from '../propertyTypes.mjs';
import './c-animation-preview.mjs';
import './c-toggle-button.mjs';

const { content } = document.getElementById('layer');

export var sharedStyleContent = `
form {
  display: flex;
  flex-direction: column;
  margin: 0;
  height: 100%;
}
button{
  -webkit-appearance: none;
  background: var(--interactive-background-color);
  color: var(--font-color);
  border: 1px solid var(--border-color);
  border-radius: 2px;
  cursor: pointer;
}
button[disabled] {
  color: grey;
  cursor: default;
}
button + button {
  margin-left: var(--padding);
}
input {
  -webkit-appearance: none;
  background-color: var(--interactive-background-color);
  color: var(--font-color);
  padding: 2px 0 2px var(--padding);
  border: 1px solid var(--actionable-color);
  border-width: 0 0 1px 0;
  max-width: 40px;
}
input + button {
  padding: 2px;
  max-width: 15px;
  margin-left: 4px;
  color: var(--font-color-dark);
}
input[type='color'] {
  padding: 0;
  border-radius: 4px;
  width: 100%;
  height: 1.5rem;
  max-width: none;
}
div ~ div {
  padding-top: 0;
}
.is-disabled {
  height: 0.2rem;
  margin: var(--padding) var(--padding) 0;
  background-color: var(--disabled-color);
}
.is-enabled {
  background-color: var(--enabled-color);
}
.properties{
  flex: 1;
  margin: var(--padding) 0;
}

button {
  flex: 1;
}

table {
  width: 100%;
}
td:last-child{
  width: 60px;
}

td,
th {
  text-align: left;
  font-weight: normal;
  white-space: nowrap;
  font-size: var(--font-size);
  color: var(--font-color);
}
th {
  color: var(--font-color-dark);
}
.actions,
.properties {
  padding: var(--padding);
}
.actions {
  display: flex;
}
.actions + .actions,
.actions + .properties {
  padding-top: 0;
}`;

var styleContent = `
${sharedStyleContent}
:host > div {
  height: 100%;
}
.animation-name {
  font-size: var(--font-size);
  color: var(--font-color);
  padding: var(--padding);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
`;

window.customElements.define(
  'c-layer',
  class extends HTMLElement {
    static get observedAttributes() {
      return ['index'];
    }

    get moduleSpecifier() {
      return this._moduleSpecifier;
    }
    set moduleSpecifier(specifier = false) {
      this._moduleSpecifier = specifier;
      this._moduleSpecifierChanged = true;
      if (specifier) {
        this.actions.clear.removeAttribute('disabled');
        this.actions.toggleEnabled.removeAttribute('disabled', '');
        this.actions.apply.removeAttribute('disabled', '');
        import(specifier).then(({ name }) => {
          this.animationName = name;
        });
      } else {
        this.actions.clear.setAttribute('disabled', '');
        this.actions.toggleEnabled.setAttribute('disabled', '');
        this.actions.apply.setAttribute('disabled', '');
        this.animationName = undefined;
      }
    }

    get isEnabled() {
      return this._isEnabled;
    }
    set isEnabled(_value) {
      const value = !this.moduleSpecifier ? false : _value;

      this._isEnabled = value;
      if (this.isEnabled) {
        events.trigger('enableLayer', { data: { index: this.index } });
        this.actions.toggleEnabled.setAttribute('is-on', '');
        this.nodes.enabledIndicator.classList.add('is-enabled');
      } else {
        events.trigger('disableLayer', { data: { index: this.index } });
        this.actions.toggleEnabled.removeAttribute('is-on');
        this.nodes.enabledIndicator.classList.remove('is-enabled');
      }
    }

    set animationName(v = '') {
      this.nodes.animationName.innerText = v;
    }

    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
      {
        const styles = document.createElement('style');
        styles.textContent = styleContent;
        this.shadowRoot.appendChild(styles);
      }

      this.shadowRoot.appendChild(content.cloneNode(true));

      this.nodes = new NodesProxy(this.shadowRoot);
      this.actions = new ActionsProxy(this.shadowRoot);

      this.isEnabled = false;

      this.actions.toggleEnabled.isOn = false;
      this.actions.toggleEnabled.handler = enabled => {
        this.isEnabled = enabled;
        this.storeProperties();
      };
      this.actions.toggleEnabled.setAttribute('disabled', '');

      this.actions.clear.addEventListener('click', this.clear.bind(this));
      this.actions.load.addEventListener('click', this.selectAnimation.bind(this));

      this.nodes.propertiesBody.addEventListener(
        'click',
        ({ target }) => {
          if (target.nodeName === 'BUTTON') {
            const node = target.previousSibling;
            node.value = node.getAttribute('placeholder');
          }
        },
        false
      );

      this.nodes.propertiesTable.setAttribute('hidden', '');
      this.nodes.form.addEventListener('submit', submit.bind(this));

      this.addEventListener('mouseenter', () => {
        events.trigger('focusLayer', {
          index: this.index
        });
      });
      this.addEventListener('mouseleave', () => {
        events.trigger('unfocusLayer', {
          index: this.index
        });
      });

      events.listen('selectedAnimationToLoad', data => {
        this._selectedAnimationToLoad = data;
        this.actions.load.removeAttribute('disabled');
      });

      events.listen('loadedAnimationIntoLayer', () => {
        delete this._selectedAnimationToLoad;
        this.actions.load.setAttribute('disabled', '');
      });
    }

    selectAnimation() {
      if (!('_selectedAnimationToLoad' in this)) {
        return;
      }
      const { specifier } = this._selectedAnimationToLoad;
      this.isEnabled = false;
      this.moduleSpecifier = specifier;

      this.nodes.form.dispatchEvent(new Event('submit'));
      events.trigger('loadedAnimationIntoLayer');
    }

    clear() {
      this.isEnabled = false;
      this.nodes.propertiesTable.setAttribute('hidden', '');
      this.nodes.propertiesBody.innerHTML = '';
      events.trigger('clearLayer', { data: { index: this.index } });
      events.trigger('disableMidiLayerToggle', { data: { index: this.index } });
      this.moduleSpecifier = undefined;

      this.storeProperties();
    }

    toggleIsEnabled() {
      this.isEnabled = !this.isEnabled;
      this.storeProperties();
    }

    getLayerProperties() {
      const { isEnabled, moduleSpecifier } = this;
      if (moduleSpecifier) {
        return Object.assign({ isEnabled, moduleSpecifier }, getFormValues(this.nodes.form));
      }
    }

    setLayerProperties(args) {
      if (args) {
        this.moduleSpecifier = args.moduleSpecifier;
        delete args.moduleSpecifier;

        this.isEnabled = args.isEnabled;
        delete args.isEnabled;

        this.preSelectedValues = args;
      }
    }

    setClientLayerProperties() {
      if (this.moduleSpecifier) {
        const { isEnabled } = this;
        this.justLoadAnyway = true;

        this.nodes.form.dispatchEvent(new Event('submit'));

        setTimeout(() => {
          this.isEnabled = isEnabled;
        }, 1000);
      } else {
        this.clear();
      }
    }

    storeProperties() {
      const layerProperties = this.getLayerProperties();

      if (layerProperties) {
        localStorage.setItem(`layerProperties-${this.index}`, JSON.stringify(layerProperties));
      } else {
        localStorage.removeItem(`layerProperties-${this.index}`);
      }
    }

    restoreProperties() {
      const stored = JSON.parse(localStorage.getItem(`layerProperties-${this.index}`));
      if (stored) {
        this.setLayerProperties(stored);
        this.setClientLayerProperties();
      }
    }

    connectedCallback () {
      this.restoreProperties();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      this.index = parseInt(newValue, 10);
    }
  }
);

async function submit(e) {
  e.preventDefault();

  const { moduleSpecifier, justLoadAnyway } = this;
  delete this.justLoadAnyway;

  const values = getFormValues(e.target);

  if ((this._moduleSpecifierChanged && moduleSpecifier) || justLoadAnyway) {
    this._moduleSpecifierChanged = false;
    events.trigger('enableMidiLayerToggle', { data: { index: this.index } });

    if (!this.preSelectedValues) {
      this.preSelectedValues = values;
    }

    // load the module and invoke it and load the animations to get the properties
    // match them and add them as a placeholder to indicate default values
    let mod;
    try {
      mod = await import(moduleSpecifier);
    } catch (e) {
      console.error(e);
      console.info(
        `clearing layer ${
          this.index
        } since loading the animation ${moduleSpecifier} ecountered problems`
      );
      this.clear();
    }

    const invoked = new mod.default();

    empty(this.nodes.propertiesBody);

    mod.properties.map(v => {
      if (v === 'color') {
        const tr = document.createElement('tr');

        const td = document.createElement('td');
        td.colSpan = '2';

        const input = document.createElement('input');
        input.type = 'color';
        input.name = 'color';
        input.value = '#ffffff';
        td.appendChild(input);
        tr.appendChild(td);

        this.nodes.propertiesBody.append(tr);
      } else {
        const t = propertyTypes[v];
        const tr = document.createElement('tr');

        const td1 = document.createElement('td');
        td1.innerText = v;
        tr.appendChild(td1);

        const td2 = document.createElement('td');
        tr.appendChild(td2);

        const input = document.createElement('input');
        input.placeholder = invoked[v];
        input.type = 'number';
        input.min = t.min;
        input.max = t.max;
        input.step = t.step;
        input.autocomplete = 'off';
        input.name = v;
        td2.appendChild(input);

        const button = document.createElement('button');
        button.type = 'button';
        button.tabindex = '-1';
        button.innerText = '<';
        td2.appendChild(button);

        this.nodes.propertiesBody.append(tr);
      }
    });

    this.nodes.propertiesTable.removeAttribute('hidden');

    if (this.preSelectedValues) {
      Object.keys(this.preSelectedValues).forEach(property => {
        const input = this.nodes.propertiesBody.querySelector(`[name=${property}`);
        if (input) {
          input.value = this.preSelectedValues[property];
        }
      });
      delete this.preSelectedValues;
    }

    this.storeProperties();

    // send the loadAnimation to the clients
    events.trigger('loadAnimation', {
      data: {
        index: this.index,
        moduleSpecifier,
        properties: values
      }
    });
  } else {
    events.trigger('setLayerProperties', {
      data: {
        index: this.index,
        properties: values
      }
    });

    this.storeProperties();
  }
}
