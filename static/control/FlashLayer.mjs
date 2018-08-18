import * as dom from './dom.mjs';
import * as events from './events.mjs';

const markup = `
<form>
  <div class="is-disabled is-enabled"></div>
  <div class="actions">
    <button>apply</button>
  </div>
  <div class="parameters">
    <table>
      <thead>
        <tr>
          <th>name</th>
          <th>value</th>
        </tr>
      </thead>
      <tbody>
        <tr><td colspan="2"><input value="#ffffff" type="color" name="color" /></td></tr>
        <tr><td>opacity</td><td><input value="1" type="number" min="0" max="1" autocomplete="off" step=".1" name="opacity" /></td></tr></tbody>
      </tbody>
    </table>
  </div>
</form>`;

export default class FlashLayer {
  constructor(options) {
    this.index = options.index;
    this.node = dom.create('div');
    this.isEnabled = true;

    const { node } = this;
    node.className = 'flash-layer layer';
    node.innerHTML = markup;

    this.formNode = dom.qSelect('form', node);

    this.formNode.addEventListener('submit', e => {
      e.preventDefault();

      const values = dom.getFormValues(e.target);

      // console.log(values);

      events.trigger('setParameters', {
        data: {
          index: 'flashLayer',
          parameters: values
        }
      });
    });
  }

  getControlParameters() {
    return dom.getFormValues(this.formNode);
  }
  setControlParameters(args) {
    if (args) {
      Object.keys(args).forEach(name => {
        this.formNode.querySelector(`[name=${name}]`).value = args[name];
      });
      this.formNode.dispatchEvent(new Event('submit'));
    }
  }
}
