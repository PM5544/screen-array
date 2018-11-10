import { getFormValues } from '../dom.mjs';
import * as events from '../events.mjs';
import * as propertyTypes from '../propertyTypes.mjs';

const { content } = document.getElementById('layer');

window.customElements.define(
  'c-layer',
  class extends HTMLElement {
    static get observedAttributes() {
      return ['index'];
    }

    constructor() {
      super();

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
    }

    enable(forced = false) {
      if (forced || (this.isEnabled === false && this.moduleId)) {
        this.isEnabled = true;
        events.trigger('enableLayer', { data: { index: this.index } });
        this.enableNode.setAttribute('disabled', true);
        this.disableNode.removeAttribute('disabled');
        this.enabledIndicator.classList.add('is-enabled');
      }
    }

    disable(forced = false) {
      if (forced || (this.isEnabled === true && this.moduleId)) {
        this.isEnabled = false;
        events.trigger('disableLayer', { data: { index: this.index } });
        this.enableNode.removeAttribute('disabled');
        this.disableNode.setAttribute('disabled', true);
        this.enabledIndicator.classList.remove('is-enabled');
      }
    }

    toggleIsEnabled() {
      if (this.isEnabled) {
        this.disable();
      } else {
        this.enable();
      }
    }

    getLayerProperties() {
      if (this.moduleId) {
        return Object.assign({ isEnabled: this.isEnabled }, getFormValues(this.formNode));
      }
    }

    setLayerProperties(args) {
      if (args) {
        const { moduleId } = args;
        this.preSelected = moduleId;
        this.preEnabled = args.isEnabled;
        delete args.isEnabled;
        delete args.moduleId;
        this.preSelectedValues = args;
      }
    }

    setClientLayerProperties() {
      // this.moduleId = null;
      const { isEnabled } = this;
      this.justLoadAnyway = true;
      this.formNode.dispatchEvent(new Event('submit'));

      setTimeout(() => {
        if (isEnabled) {
          this.enable(true);
        } else {
          this.disable(true);
        }
      }, 1000);
    }

    connectedCallback() {
      if (this._domIitialised) {
        return;
      }
      this._domIitialised = true;

      this.appendChild(content.cloneNode(true));

      this.enabledIndicator = this.querySelector('[data-selector=enabledIndicator]');
      this.enableNode = this.querySelector('[data-action=enable]');
      this.enableNode.addEventListener('click', e => {
        e.preventDefault();
        this.enable();
      });
      this.disableNode = this.querySelector('[data-action=disable]');
      this.disableNode.addEventListener('click', e => {
        e.preventDefault();
        this.disable();
      });

      this.disable(true);

      this.animationSelectNode = this.querySelector('[name=moduleId]');
      events.listen('allAnimationData', data => {
        populateAnimationsDropDown.call(this, data);
      });

      this.parameterNode = this.querySelector('[data-selector=properties]');
      this.propertiesTable = this.parameterNode.querySelector('table');
      this.parameterBodyNode = this.querySelector('[data-selector=propertiesBody]');
      this.parameterBodyNode.addEventListener(
        'click',
        ({ target }) => {
          if (target.nodeName === 'BUTTON') {
            const node = target.previousSibling;
            node.value = node.getAttribute('placeholder');
          }
        },
        false
      );

      this.propertiesTable.setAttribute('hidden', '');
      // this.parameterNode.classList.add('hidden');

      this.formNode = this.querySelector('form');
      this.formNode.addEventListener('submit', submit.bind(this));

      const stored = JSON.parse(localStorage.getItem(`layerProperties-${this.index}`));
      this.setLayerProperties(stored);
      setTimeout(() => {
        this.setClientLayerProperties();
      }, 1000);
    }

    disconnectedCallback() {
      console.log('disconnected!');
    }

    attributeChangedCallback(name, oldValue, newValue) {
      console.log(name, oldValue, newValue);
      this.index = parseInt(newValue, 10);
    }

    adoptedCallback() {
      console.log('adopted!');
    }
  }
);

function submit(e) {
  e.preventDefault();

  const { justLoadAnyway } = this;
  delete this.justLoadAnyway;

  const values = getFormValues(e.target);

  const { moduleId } = values;
  delete values.moduleId;

  if (!moduleId) {
    this.disable(true);
    this.propertiesTable.setAttribute('hidden', '');
    this.parameterBodyNode.innerHTML = '';
    events.trigger('clearLayer', { data: { index: this.index } });
    events.trigger('disableLayerToggle', { data: { index: this.index } });
    this.moduleId = null;
  } else if ((moduleId && moduleId !== this.moduleId) || justLoadAnyway) {
    this.moduleId = moduleId;
    events.trigger('enableLayerToggle', { data: { index: this.index } });

    if (!this.preSelectedValues) {
      this.preSelectedValues = values;
    }

    // load the module and invoke it and load the animations to get the properties
    // match them and add them as a placeholder to indicate default values
    import(moduleId)
      .then(mod => [new mod.default(), mod])
      .then(([invoked, { properties }]) => {
        this.parameterBodyNode.innerHTML = properties
          .map(v => {
            if (v === 'color') {
              return `<tr><td colspan=2>
                <input type=color name=color value=#ffffff />
                </td></tr>`;
            }
            const t = propertyTypes[v];
            return `<tr><td>${v}</td>
              <td><input placeholder="${invoked[v]}" type=number min="${
              t.min
            }" max="${t.max}" autocomplete=off step="${
              t.step
            }" name="${v}" /><button type=button tabindex="-1"><</button></td></tr>`;
          })
          .join('');
        this.propertiesTable.removeAttribute('hidden');

        if (this.preSelectedValues) {
          Object.keys(this.preSelectedValues).forEach(property => {
            this.parameterBodyNode.querySelector(
              `[name=${property}`
            ).value = this.preSelectedValues[property];
          });
          delete this.preSelectedValues;
        }

        // send the loadAnimation to the clients
        events.trigger('loadAnimation', {
          data: {
            index: this.index,
            moduleId,
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
  }

  const layerProperties = this.getLayerProperties();
  if (layerProperties) {
    localStorage.setItem(`layerProperties-${this.index}`, JSON.stringify(layerProperties));
  } else {
    localStorage.removeItem(`layerProperties-${this.index}`);
  }
}

function replaceFirstOptionText({ target }) {
  target.firstChild.textContent = 'no animation';
  target.removeEventListener('change', replaceFirstOptionText);
}

function populateAnimationsDropDown(animations) {
  const { value } = this.animationSelectNode;
  const { preSelected } = this;
  const selectedValue = preSelected || value;

  this.animationSelectNode.innerHTML = ['<option value="">select animation</option>']
    .concat(
      animations.map(
        v =>
          `<option value="${v.path}" ${v.path === selectedValue ? 'selected' : ''}>${
            v.name
          }</option>`
      )
    )
    .join('');
  if (preSelected) {
    this.formNode.dispatchEvent(new Event('submit'));
    if (this.preEnabled) {
      this.enable(true);
    }
    delete this.preSelected;
    delete this.preEnabled;
  }
  this.animationSelectNode.addEventListener('change', replaceFirstOptionText);
}
