import * as animationUtils from '../utils/animation.mjs';
import { minute } from '../utils/time.mjs';
import { rpm } from '../control/propertyTypes.mjs';

export const name = 'spining line';
export const tags = ['trigger'];
export const properties = ['color', 'radius', 'lineWidth', 'opacity', 'rpm'];

export default class {
  set primary(val) {
    this.rpm = val;
  }

  get primary() {
    return this.rpm;
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
    this.opacity = 1;
    this.rpm = rpm.defaultValue;
  }

  restart() {
    this.radian = 0;
  }

  render(ctx, timestamp) {
    this.radian = ((timestamp / minute) * (Math.PI * 2)) * this.rpm;

    ctx.strokeStyle = `rgba(${this.r},${this.g},${this.b},${this.opacity}`;
    animationUtils.set(ctx, 'lineWidth', this.lineWidth);
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
  }
}
