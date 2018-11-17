import * as animationUtils from '../utils/animation.mjs';

const circleEnd = Math.PI * 2;

export const name = 'swipe line';
export const tags = ['simple', 'singleColor'];
export const properties = ['color', 'frameCount', 'lineWidth', 'opacity'];

export default class {
  set primary(val) {
    this.frameCount = 10 + Math.round(val * 50);
  }

  get primary() {
    return this.frameCount;
  }

  constructor(...args) {
    animationUtils.extend.call(this, args);
    this.reset();
    this.frame = this.stopFrame;
  }

  reset() {
    this.lineWidth = 5;
    this.r = 256;
    this.g = 256;
    this.b = 256;
    this.opacity = 1;

    this.frameCount = 200;
    this.stopFrame = 230;
  }

  restart() {
    this.frame = 0;
  }

  render(ctx) {
    if (this.frame === this.stopFrame) {
      return;
    } else if (this.frame < this.frameCount) {

      ctx.strokeStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`;
      ctx.lineWidth = this.lineWidth;

      ctx.translate(-(this.clientIndexOnSide * this.width), 0);

      ctx.beginPath();
      ctx.arc(
        this.clientIsMirrored ? this.clientCountOnSide * this.width : 0,
        this.centerY,
        this.frame / this.frameCount * (this.clientCountOnSide * this.width),
        0,
        circleEnd
      );
      ctx.stroke();

      ctx.translate(this.clientIndexOnSide * this.width, 0);

      this.frame++;
    } else {
      this.frame = this.stopFrame;
    }
  }
}
