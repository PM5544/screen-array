import * as animationUtils from '../utils/animation.mjs';

export const name = 'wide';
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

  render(ctx, ) {

    animationUtils.set(ctx, 'strokeStyle', `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`);
    animationUtils.set(ctx, 'lineWidth', this.lineWidth);
    ctx.translate(-(this.clientIndexOnSide * this.width), 0);
    ctx.beginPath();
    if (this.clientIsMirrored) {
      ctx.moveTo(0, 0);
      ctx.lineTo(this.clientCountOnSide * this.width, this.height);
    } else {
      ctx.moveTo(this.clientCountOnSide * this.width, 0);
      ctx.lineTo(0, this.height);
    }
    ctx.stroke();
    ctx.translate(this.clientIndexOnSide * this.width, 0);
  }
}
