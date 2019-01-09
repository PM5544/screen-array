import * as animationUtils from '../utils/animation.mjs';

export const name = 'kick';
export const tags = ['kick', 'audio'];
export const properties = ['color', 'opacity'];

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
    this.r = 256;
    this.g = 256;
    this.b = 256;
    this.opacity = 1;
  }

  restart() {}

  render(ctx, timestamp, {kick}) {
    if ('undefined' !== typeof kick && 100 === kick) {
      animationUtils.set(ctx, 'fillStyle', `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`);

      ctx.fillRect(20, 20, 100, 100);
    }
  }
}
