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
    this.yMax = this.height * .25;
    this.yMin = this.height * .75;
    this.reset();
  }

  reset() {
    this.lineWidth = 1;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.opacity = 1;
    this.pixelsPerSecond = 10;
    this.start = new Date().getTime();
  }

  restart() {}

  render(ctx, timestamp) {

    this.y = Math.sin(); // calculate y based on timestamp / sine with this.min this.max

    ctx.beginPath();
    animationUtils.set(ctx, 'lineWidth', this.lineWidth);
    animationUtils.set(ctx, 'strokeStyle', `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`);

    ctx.moveTo(0, this.y);
    ctx.lineTo(this.sideWidth, this.y);
    ctx.stroke();
  }
}
