import * as events from '../events.mjs';
import { second, minute } from '../time.mjs';

const bpmHigh = 160;
const bpmLow = 80;
const bars = 4;
const activeClassName = 'active';

const styleContent = `
:host {
  display: flex;
  margin: 0 var(--padding);
  padding: var(--padding);
  border: 1px solid var(--border-color);
  min-width: 120px;
}
:host > div {
  margin: 0 2px;
  flex: 1;
  border: 1px solid var(--border-color);
  background: var(--disabled-color);
}
:host > div.${activeClassName} {
  background: var(--enabled-color);
  border-color: var(--actionable-color);
}
:host > span {
  font-family: monospace;
  color: var(--font-color);
  padding: 0 .3rem;
  line-height: 0;
}
`;

window.customElements.define(
  'c-beat-indicator',
  class extends HTMLElement {
    constructor() {
      super();

      this.beatNodes = [];
      this.interval;
      this.iterator = 0;
      this._shadowRoot = this.attachShadow({ mode: 'open' });

      const styles = document.createElement('style');
      styles.textContent = styleContent;
      this._shadowRoot.appendChild(styles);

      let _bars = bars;
      while (--_bars >= 0) {
        this._shadowRoot.appendChild(document.createElement('div'));
      }
      this.beatNodes = Array.from(this._shadowRoot.querySelectorAll('div'));

      this.textIndicator = document.createElement('span');
      this.textIndicator.innerText = '---,--';

      this._shadowRoot.appendChild(this.textIndicator);

      events.listen('beatSyncRestart', this.syncRestart.bind(this));
    }

    next() {
      this.deactivatePrevious();
      this.beatNodes[this.iterator].classList.add('active');

      this.iterator++;
      if (this.iterator === bars) {
        this.iterator = 0;
      }
    }

    deactivatePrevious () {
      if (0 !== this.iterator) {
        this.beatNodes[this.iterator - 1].classList.remove('active');
      } else {
        this.beatNodes[bars - 1].classList.remove('active');
      }
    }

    sync() {
      clearInterval(this.interval);
      this.deactivatePrevious();
      this.iterator = 0;
      this.interval = setInterval(this.next.bind(this), minute / this.bpm);
      this.next();
    }

    syncRestart() {
      const now = Date.now();

      if (this.previousSyncRestart) {
        const difference = now - this.previousSyncRestart;
        let bpm = minute / difference;

        if (bpm > bpmHigh) {
          while (bpm > bpmHigh) {
            bpm /= 2;
          }
        } else if (bpm < bpmLow) {
          while (bpm < bpmLow) {
            bpm *= 2;
          }
        }
        this.bpm = bpm;
        this.sync();
      }

      this.previousSyncRestart = now;
    }

    connectedCallback() {
      console.log('Layers connected!');
    }

    disconnectedCallback() {
      console.log('Layers disconnected!');
    }

    // attributeChangedCallback(name, oldValue, newValue) {
    //   console.log(name, oldValue, newValue);
    // }

    adoptedCallback() {
      console.log('Layers adopted!');
    }
  }
);
