import * as animationUtils from '../utils/animation.mjs';

export const name = 'curve';
export const tags = ['all screens'];
export const properties = ['color', 'height', 'stepSize', 'lineWidth', 'opacity'];

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
    this.height = 250;
    this.stepSize = 1;
    this.lineWidth = 5;
    this.offset = 0;
    this.r = 256;
    this.g = 256;
    this.b = 256;
    this.opacity = 1;
  }

  restart() {
    this.offset = 0;
  }

  render(ctx, timestamp) {
    const partX = this.width / 2;

    animationUtils.set(ctx, 'strokeStyle', `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`);
    animationUtils.set(ctx, 'lineWidth', this.lineWidth);

    // ctx.moveTo(this.offSet - width, centerY);
    ctx.beginPath();
    ctx.moveTo(this.offset - this.width, this.centerY);

    ctx.bezierCurveTo(
      -this.offset - this.width + partX,
      this.centerY - this.height,
      -this.offset - partX,
      this.centerY + this.height,
      -this.offset,
      this.centerY
    );
    ctx.bezierCurveTo(
      -this.offset + partX,
      this.centerY - this.height,
      -this.offset + this.width - partX,
      this.centerY + this.height,
      -this.offset + this.width,
      this.centerY
    );
    ctx.bezierCurveTo(
      -this.offset + this.width + partX,
      this.centerY - this.height,
      -this.offset + this.width + this.width - partX,
      this.centerY + this.height,
      -this.offset + this.width + this.width,
      this.centerY
    );
    ctx.stroke();

    this.offset += this.stepSize;
    if (this.offset > this.width) {
      this.offset -= this.width;
    }
  }
}
