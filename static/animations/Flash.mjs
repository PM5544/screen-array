export const name = 'flash';
export const tags = ['simple', 'singleColor'];
export const properties = ['color', 'opacity'];

export default class {
  set primary(val) {
    this.opacity = val;
  }

  get primary() {
    return this.opacity;
  }

  constructor() {
    this.reset();
  }

  reset() {
    this.r = 256;
    this.g = 256;
    this.b = 256;
    this.opacity = 1;
  }

  restart() {}

  render(ctx, dimension) {
    const { width, height } = dimension;
    const { r, g, b, opacity } = this;

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    ctx.fillRect(0, 0, width, height);
  }
}
