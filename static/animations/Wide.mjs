export const name = 'wide';
export const tags = ['simple', 'singleColor'];
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
    this.lineWidth = 5;
    this.r = 256;
    this.g = 256;
    this.b = 256;
    this.opacity = 1;
  }

  restart() {
    // this.frame = 0;
  }

  render(ctx, dimension) {
    const { width, height } = dimension;
    const {
      r,
      g,
      b,
      opacity,
      position: { index, total, mirrored }
    } = this;

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    ctx.lineWidth = this.lineWidth;
    ctx.translate(-(index * width), 0);
    ctx.beginPath();
    if (mirrored) {
      ctx.moveTo(0, 0);
      ctx.lineTo(total * width, height);
    } else {
      ctx.moveTo(total * width, 0);
      ctx.lineTo(0, height);
    }
    ctx.stroke();
    ctx.translate(index * width, 0);
  }
}
