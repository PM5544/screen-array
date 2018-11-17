import { SCREEN_PROPORTION, SCREEN_WIDTH } from '../../constants.mjs';

const spectrum = [20, 30, 20, 10, 15, 7, 8, 12, 24, 56, 27, 82];

window.customElements.define(
  'c-animation-preview',
  class extends HTMLCanvasElement {
    static get observedAttributes() {
      return ['specifier'];
    }

    load() {
      import(this.specifier).then(A => {
        this.animation = new A.default({
          index: 1,
          total: 3,
          clientIsMirrored: false
        });
        this.animation.render(this.ctx, this.dimensions, { spectrum });
      });
    }

    attributeChangedCallback(...[, , specifier]) {
      this.specifier = specifier;
      this.load();
    }

    connectedCallback() {
      this.ctx = this.getContext('2d', { alpha: false });
      const measuredWidth = this.offsetWidth;
      const w = measuredWidth - (measuredWidth % SCREEN_WIDTH);
      const h = w * SCREEN_PROPORTION;

      this.dimensions = {
        width: w,
        height: h,
        centerX: w / 2,
        centerY: h / 2
      };
      this.width = w;
      this.height = h;
    }
  },
  { extends: 'canvas' }
);
