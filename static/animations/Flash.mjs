import * as animationUtils from '../utils/animation.mjs';

export const name = 'flash';
export const tags = ['simple', 'singleColor'];
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

  render(ctx) {

    ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`;

    ctx.fillRect(0, 0, this.width, this.height);
  }
}
