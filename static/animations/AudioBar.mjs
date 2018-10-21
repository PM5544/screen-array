export const name = 'audioBar';
export const tags = ['simple', 'singleColor'];
export const parameters = ['lineWidth', 'color', 'opacity'];

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

  render(ctx, properties, _levels = false) {
    if (!_levels) {
      return;
    }

    const { width, height } = properties;
    const {
      r,
      g,
      b,
      opacity,
      // lineWidth,
      // x,
      // offset,
      position: { /* index, total = 1, */ mirrored = false }
    } = this;

    const levels = _levels[mirrored ? 'right' : 'left'];

    const size = width / levels.length;
    const one = height / 100;

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    ctx.lineWidth = this.lineWidth;

    ctx.beginPath();
    levels.forEach((v, i) => {
      ctx.lineTo(i * size, height - (v * one));
    });

    ctx.stroke();
  }
}
