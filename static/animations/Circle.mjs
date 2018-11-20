import * as animationUtils from '../utils/animation.mjs';

const circleEnd = Math.PI * 2;

export const name = 'circle medium';
export const tags = ['trigger'];
export const properties = ['color', 'frameCount', 'lineWidth', 'opacity'];

export default class {
  set primary(val) {
    this.frameCount = 20 + Math.round(val * 100);
  }

  get primary() {
    return this.frameCount;
  }

  constructor(...args) {
    animationUtils.extend.call(this, args);

    this.frame = 0;
    this.reset();
  }

  reset() {
    this.maxRadius = 700;
    this.lineWidth = 5;
    this.frameCount = 100;
    this.r = 256;
    this.g = 256;
    this.b = 256;
    this.opacity = 1;
    this.stopFrame = 130;
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

      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY, this.frame / this.frameCount * this.maxRadius, 0, circleEnd);
      ctx.stroke();

      this.frame++;
    } else {
      this.frame = this.stopFrame;
    }
  }
}
