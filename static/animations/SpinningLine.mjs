import * as animationUtils from '../utils/animation.mjs';

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

  constructor(...args) {
    animationUtils.extend.call(this, args);
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

  render(ctx) {

    ctx.strokeStyle = `rgba(${this.r},${this.g},${this.b},${this.opacity}`;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();

    ctx.moveTo(
      this.centerX - Math.cos(this.radian) * this.radius,
      this.centerY - Math.sin(this.radian) * this.radius
    );
    ctx.lineTo(
      this.centerX + Math.cos(this.radian) * this.radius,
      this.centerY + Math.sin(this.radian) * this.radius
    );
    ctx.stroke();

    this.radian += this.velocity;
    if (this.radian >= 1000) {
      this.radian -= 1000;
    }
  }
}
