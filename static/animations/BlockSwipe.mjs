import * as animationUtils from '../utils/animation.mjs';

export const name = 'block swipe';
export const tags = ['simple', 'block', 'singleColor'];
export const properties = ['color', 'frameCount', 'opacity'];

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
    this.frame = 12;
    this.frameCount = 12;
    this.r = 0xff;
    this.g = 0xff;
    this.b = 0xff;
    this.opacity = 1;
  }

  restart() {
    this.frame = 0;
  }

  render(ctx) {
    if (this.frame < this.frameCount) {
      const halfCount = Math.floor(this.frameCount / 2);

      ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`;

      let left;
      if (this.frame > halfCount) {
        left = this.width * ((this.frame - halfCount) / halfCount);
      } else {
        left = 0;
      }

      let _width;
      if (this.frame < halfCount) {
        _width = this.width * this.frame / halfCount;
      } else {
        _width = this.width;
      }

      ctx.fillRect(left, 0, _width, this.height);

      this.frame++;
    }
  }
}
