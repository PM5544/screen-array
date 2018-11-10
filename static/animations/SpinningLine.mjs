export const name = 'spining line';
export const tags = ['simple', 'singleColor'];
export const properties = ['color', 'radius', 'lineWidth', 'opacity', 'velocity'];

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
    this.radian = 0;
    this.radius = 200;
    this.lineWidth = 5;
    this.r = 256;
    this.g = 256;
    this.b = 256;
    this.opacity = 0.5;
    this.velocity = 0.1;
  }

  restart() {
    this.radian = 0;
  }

  render(ctx, dimension) {
    const { centerX, centerY } = dimension;
    const { r, g, b, opacity } = this;

    ctx.strokeStyle = `rgba(${r},${g},${b},${opacity}`;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();

    ctx.moveTo(
      centerX - Math.cos(this.radian) * this.radius,
      centerY - Math.sin(this.radian) * this.radius
    );
    ctx.lineTo(
      centerX + Math.cos(this.radian) * this.radius,
      centerY + Math.sin(this.radian) * this.radius
    );
    ctx.stroke();

    this.radian += this.velocity;
    if (this.radian >= 1000) {
      this.radian -= 1000;
    }
  }
}
