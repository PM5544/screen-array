import * as dom from './dom.mjs';
import * as events from './events.mjs';
import { control } from './socket.mjs';
const exportRegexp = /^export const.*\;$/gm;

const markup = `
<form>
  <div data-selector="enabledIndicator" class="is-disabled"></div>
  <div class="actions">
    <select name="moduleId"></select>
  </div>
  <div class="actions">
    <button>apply</button>
  </div>
  <div class="actions">
    <button data-action="enable" form="">enable</button>
    <button data-action="disable" form="">disable</button>
  </div>
  <div class="parameters" data-selector="parameters">
    <table>
      <thead>
        <tr>
          <th>name</th>
          <th>value</th>
        </tr>
      </thead>
      <tbody data-selector="parametersBody"></tbody>
    </table>
  </div>
</form>`;

export default class Layer {
  constructor(options) {
    this.index = options.index;
    this.node = dom.create('div');

    const { node } = this;
    node.className = 'layer';
    node.innerHTML = markup;

    this.moduleId;

    this.enabledIndicator = dom.qSelect('[data-selector=enabledIndicator]', node);
    this.enableNode = dom.qSelect('[data-action=enable]', node);
    this.enableNode.addEventListener('click', e => {
      e.preventDefault();
      this.enable();
    });
    this.disableNode = dom.qSelect('[data-action=disable]', node);
    this.disableNode.addEventListener('click', e => {
      e.preventDefault();
      this.disable();
    });

    this.disable(true);

    this.formNode = dom.qSelect('form', node);
    this.animationSelectNode = dom.qSelect('[name=moduleId]', node);

    this.parameterNode = dom.qSelect('[data-selector=parameters]', node);
    this.parameterBodyNode = dom.qSelect('[data-selector=parametersBody]', node);
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

    this.parameterNode.classList.add('hidden');

    this.formNode.addEventListener('submit', e => {
      e.preventDefault();

      const values = dom.getFormValues(e.target);
      // console.log(values);

      const { moduleId } = values;
      delete values.moduleId;

      if (!moduleId) {
        this.disable(true);
        this.parameterNode.classList.add('hidden');
        this.parameterBodyNode.innerHTML = '';
        events.trigger('clearLayer', { data: { index: this.index } });
        events.trigger('disableLayerToggle', { data: { index: this.index } });
        this.moduleId = null;
      } else if (moduleId && moduleId !== this.moduleId) {
        this.moduleId = moduleId;
        events.trigger('enableLayerToggle', { data: { index: this.index } });

        if (!this.preSelectedValues) {
          this.preSelectedValues = values;
        }

        // when Chromium for Raspian gets support for dynamic imports this can be rewritten to import(moduleId)
        fetch(moduleId)
          .then(r => r.text())
          .then(r => r.replace('export default', 'return').replace(exportRegexp, ''))
          .then(moduleString => {
            events.trigger('loadAnimation', {
              data: {
                index: this.index,
                moduleId,
                moduleString,
                parameters: values
              }
            });
          })
          .catch(console.error);

        // load the module and initialize it and load the animations to get the parameters
        // match them and add them as a placeholder to indicate default values
        import(moduleId)
          .then(mod => [new mod.default(), mod])
          .then(([initialised, { parameters }]) => {
            this.parameterNode.classList.remove('hidden');
            this.parameterBodyNode.innerHTML = parameters
              .map(
                v =>
                  `<tr>${
                    v === 'color'
                      ? `<td colspan="2">
                          <input type="color" name="color" value="#ffffff" />
                        </td>`
                      : `<td>${v}</td>
                        <td><input placeholder="${
                          initialised[v]
                        }" type="number" min="0" max="${determineMax(
                          initialised[v]
                        )}" autocomplete="off" step="${determineStep(
                          initialised[v]
                        )}" name="${v}" /><button tabindex="-1"><</button></td>`
                  }</tr>`
              )
              .join('');

            if (this.preSelectedValues) {
              Object.keys(this.preSelectedValues).forEach(property => {
                this.parameterBodyNode.querySelector(
                  `[name=${property}`
                ).value = this.preSelectedValues[property];
              });
              delete this.preSelectedValues;
            }
          })
          .catch(console.error);
      } else {
        events.trigger('setParameters', {
          data: {
            index: this.index,
            parameters: values
          }
        });
      }
    });

    events.listen('allAnimationData', data => {
      populateAnimationsDropDown.call(this, data);
    });
  }

  enable(forced = false) {
    if (forced || (this.isEnabled === false && this.moduleId)) {
      this.isEnabled = true;
      events.trigger('enable', { data: { index: this.index } });
      this.enableNode.setAttribute('disabled', true);
      this.disableNode.removeAttribute('disabled');
      this.enabledIndicator.classList.add('is-enabled');
    }
  }

  disable(forced = false) {
    if (forced || (this.isEnabled === true && this.moduleId)) {
      this.isEnabled = false;
      events.trigger('disable', { data: { index: this.index } });
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

  setIndex(index) {
    this.index = index;
  }

  getControlParameters() {
    if (this.moduleId) {
      return Object.assign({ isEnabled: this.isEnabled }, dom.getFormValues(this.formNode));
    }
  }

  setControlParameters(args) {
    if (args) {
      const { moduleId } = args;
      this.preSelected = moduleId;
      this.preEnabled = args.isEnabled;
      delete args.isEnabled;
      delete args.moduleId;
      this.preSelectedValues = args;
    }
  }
  setAllClientLayers() {
    // this.moduleId = null;
    const { isEnabled } = this;
    this.formNode.dispatchEvent(new Event('submit'));

    setTimeout(() => {
      if (isEnabled) {
        this.enable(true);
      } else {
        this.disable(true);
      }
    }, 1000);
  }
}

function determineStep(num) {
  if (num <= 1) {
    return '0.1';
  }
  return '1';
}

function determineMax(num) {
  if (num === 256) {
    return '256';
  } else if (num === 0) {
    return '';
  } else if (num === 1) {
    return '1';
  } else if (num <= 50) {
    return '100';
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
