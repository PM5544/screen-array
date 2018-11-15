import { empty } from '../dom.mjs';

window.customElements.define(
  'c-toggle-button',
  class extends HTMLButtonElement {
    static get observedAttributes() {
      return ['is-on', 'property'];
    }

    set handler(fn) {
      this._fn = fn;
      if (fn) {
        this.removeAttribute('disabled');
      } else {
        this.setAttribute('disabled', '');
      }
    }

    set isOn(onOrOff) {
      this._isOn = onOrOff;
      this.callHandler();
      this.reflectIsOn();
    }
    get isOn() {
      return this._isOn;
    }

    set innerText(text) {
      this._textNode.innerText = text;
    }
    get innerText() {
      return this._textNode.innerText;
    }

    constructor() {
      super();

      this._textNode = document.createElement('span');
      this._textNode.textContent = this.textContent;
      empty(this);
      this.appendChild(this._textNode);

      this._indicatorNode = document.createElement('span');
      this._indicatorNode.style.display = 'inline-block';
      this._indicatorNode.style.width = '.4rem';
      this._indicatorNode.style.height = '.4rem';
      this._indicatorNode.style.marginLeft = '.2rem';
      this._indicatorNode.style.borderRadius = '2px';
      this._indicatorNode.style.border = '1px solid var(--border-color)';
      // this._indicatorNode.style.backgroundColor = 'var(--disabled-color)';
      this.appendChild(this._indicatorNode);

      this._property = undefined;
      this._isOn = undefined;
      this.handler = undefined;
      this.isOn = false;
    }

    attributeChangedCallback(attributeName, oldValue, _newValue) {
      if (_newValue === oldValue) {
        return;
      }

      let newValue;
      if (_newValue === null || _newValue === 'false') {
        newValue = false;
      } else if (_newValue === '') {
        newValue = true;
      } else {
        newValue = _newValue;
      }

      switch (attributeName) {
        case 'is-on':
          if (this.isOn !== newValue) {
            this.isOn = newValue;
          }
          break;

        case 'property':
          if (this._property !== newValue) {
            this._property = newValue;
          }
          break;
      }
    }

    handleClick(e) {
      e.preventDefault();
      this.isOn = !this.isOn;
    }

    callHandler() {
      if (this._fn) {
        if (this._property) {
          this._fn({ property: this._property, isOn: this.isOn });
        } else {
          this._fn(this.isOn);
        }
      }
    }

    reflectIsOn () {
      // update the attribute to indicate the internal state on the button element
      if (this.isOn) {
        this.setAttribute('is-on', '');
        this._indicatorNode.style.backgroundColor = 'var(--enabled-color)';
      } else {
        this.removeAttribute('is-on');
        this._indicatorNode.style.backgroundColor = 'var(--disabled-color)';
      }
    }

    connectedCallback() {
      this.addEventListener('click', this.handleClick);
    }
    disconnectedCallback() {}
    adoptedCallback() {}
  },
  { extends: 'button' }
);
