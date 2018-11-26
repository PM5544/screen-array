import * as animationUtils from '../utils/animation.mjs';

export const name = 'horizon';
export const tags = ['full side'];
export const properties = ['color', 'lineWidth', 'opacity'];

export default class {
  set primary(val) {
    this.opacity = val;
  }

  get primary() {
    return this.opacity;
  }

  constructor(...args) {
    animationUtils.extend.call(this, args);

    this.sideWidth = this.clientCountOnSide * this.width;
    this.yDiff = this.height / 4;
    this.center = this.height / 2;
    this.revolutionsPerMinute = 30;

    this.divideBy = ((1000 * 60) / this.revolutionsPerMinute) / (Math.PI * 2);
    this.reset();
  }

  reset() {
    this.lineWidth = 1;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.opacity = 1;
    this.revolutionsPerMinute = 30;
  }

  restart() {}

  render(ctx, timestamp) {

    this.y = this.center + (Math.sin(timestamp / this.divideBy) * this.yDiff);

    ctx.beginPath();
    animationUtils.set(ctx, 'lineWidth', this.lineWidth);
    animationUtils.set(ctx, 'strokeStyle', `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`);

    ctx.moveTo(0, this.y);
    ctx.lineTo(this.sideWidth, this.y);
    ctx.stroke();

    return [0, this.y-1, this.width, 2];
  }
}
