export const name = 'audioBar';
export const tags = ['audio', 'simple', 'singleColor'];
export const properties = ['color', 'lineWidth', 'opacity'];

export default class {
  set primary(val) {
    this.opacity = val;
  }

  get primary() {
    return this.opacity;
  }

  constructor(position) {
    this.position = position;
    this.reset();
  }

  reset() {
    this.lineWidth = 1;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.opacity = 1;
    this.offset = 250;
    this.x = 0;
  }

  restart() {}

  render(ctx, dimension, {spectrum = false}) {
    if (!spectrum) {
      return;
    }

    const { width, height } = dimension;
    const {
      r,
      g,
      b,
      opacity,
      // lineWidth,
      // x,
      // offset,
      position: { /* index, total = 1,  mirrored = false */ }
    } = this;

    const size = width / spectrum.length;
    const one = height / 100;

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    ctx.lineWidth = this.lineWidth;

    ctx.beginPath();
    spectrum.forEach((v, i) => {
      ctx.lineTo(i * size, height - (v * one));
    });

    ctx.stroke();
  }
}
