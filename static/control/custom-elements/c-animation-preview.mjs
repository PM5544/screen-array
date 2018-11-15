window.customElements.define(
  'c-animation-preview',
  class extends HTMLCanvasElement {
    static get observedAttributes() {
      return ['specifier'];
    }

    constructor() {
      super();

      this.spectrum = [20, 30, 20, 10, 15, 7, 8, 12, 24, 56, 27, 82];
    }

    load() {
      import(this.specifier).then(A => {
        this.animation = new A.default({
          index: 1,
          total: 3,
          mirrored: false
        });
        this.animation.render(this.ctx, this.dimensions, { spectrum: this.spectrum });
      });
    }

    attributeChangedCallback(...[, , specifier]) {
      this.specifier = specifier;
      this.load();
    }

    connectedCallback() {
      this.ctx = this.getContext('2d', { alpha: false });
      const w = this.offsetWidth;
      const h = this.offsetHeight;
      this.dimensions = {
        width: w,
        height: h,
        centerX: w / 2,
        centerY: h / 2
      };
      this.width = w;
      this.height = h;
    }

    disconnectedCallback() {}
    adoptedCallback() {}
  },
  { extends: 'canvas' }
);
