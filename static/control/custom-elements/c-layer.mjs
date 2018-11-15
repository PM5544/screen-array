import { getFormValues, NodesProxy, ActionsProxy } from '../dom.mjs';
import * as events from '../events.mjs';
import * as propertyTypes from '../propertyTypes.mjs';
import './c-animation-preview.mjs';
import './c-toggle-button.mjs';

const { content } = document.getElementById('layer');

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

    set animationName (v = '') {
      this.nodes.animationName.innerText = v;
    }


    constructor() {
      super();

      this.nodes = new NodesProxy(this);
      this.actions = new ActionsProxy(this);

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

    selectAnimation () {
      if (!('_selectedAnimationToLoad' in this)) {
        return;
      }
      const { specifier } = this._selectedAnimationToLoad;
      this.isEnabled = false;
      this.moduleSpecifier = specifier;

      this.nodes.form.dispatchEvent(new Event('submit'));
      events.trigger('loadedAnimationIntoLayer');
    }

    clear () {
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
      const { isEnabled } = this;
      this.justLoadAnyway = true;
      this.nodes.form.dispatchEvent(new Event('submit'));

      setTimeout(() => {
        this.isEnabled = isEnabled;
      }, 1000);
    }

    connectedCallback() {
      if (this._domIitialised) {
        return;
      }
      this._domIitialised = true;

      this.appendChild(content.cloneNode(true));
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

      this.restoreProperties();
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

    disconnectedCallback() {
      console.log('disconnected!');
    }

    attributeChangedCallback(name, oldValue, newValue) {
      this.index = parseInt(newValue, 10);
    }

    adoptedCallback() {}
  }
);

function submit(e) {
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
    import(moduleSpecifier)
      .then(mod => [new mod.default(), mod])
      .then(([invoked, { properties }]) => {
        this.nodes.propertiesBody.innerHTML = properties
          .map(v => {
            if (v === 'color') {
              return `<tr><td colspan=2>
                <input type=color name=color value=#ffffff />
                </td></tr>`;
            }
            const t = propertyTypes[v];
            return `<tr><td>${v}</td>
              <td><input placeholder="${invoked[v]}" type=number min="${t.min}" max="${
              t.max
            }" autocomplete=off step="${
              t.step
            }" name="${v}" /><button type=button tabindex="-1"><</button></td></tr>`;
          })
          .join('');
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
      })
      .catch(console.error);
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

// function replaceFirstOptionText({ target }) {
//   target.firstChild.textContent = 'no animation';
//   target.removeEventListener('change', replaceFirstOptionText);
// }

// function populateAnimationsDropDown(animations) {
//   const { value } = this.animationSelectNode;
//   const { preSelected } = this;
//   const selectedValue = preSelected || value;

//   this.animationSelectNode.innerHTML = ['<option value="">select animation</option>']
//     .concat(
//       animations.map(
//         v =>
//           `<option value="${v.specifier}" ${v.specifier === selectedValue ? 'selected' : ''}>${
//             v.name
//           }</option>`
//       )
//     )
//     .join('');
//   if (preSelected) {
//     this.nodes.form.dispatchEvent(new Event('submit'));
//     if (this.preEnabled) {
//       this.enable(true);
//     }
//     delete this.preSelected;
//     delete this.preEnabled;
//   }
//   this.animationSelectNode.addEventListener('change', replaceFirstOptionText);
// }
