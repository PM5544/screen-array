import * as animationUtils from '../utils/animation.mjs';

export const name = 'landscape';
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
    this.focalPoint = Math.round(this.sideWidth / 2);
    this.horizonY = Math.round(this.height * 0.5);
    this.reset();
  }

  reset() {
    this.lineWidth = 1;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.opacity = 1;
    this.offset = 250;
    this.x = 0;
  }

  restart() {
    this.x = 0;
  }

  render(ctx) {
    let lineGapY = 2;
    let lineY = this.horizonY;

    if (this.clientCountOnSide) {
      ctx.translate(-(this.clientIndexOnSide * this.width), 0);
    }

    let drawing = true;
    let xDif = 0;
    let yDif = 0;

    animationUtils.set(
      ctx,
      'strokeStyle',
      `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`
    );
    animationUtils.set(ctx, 'lineWidth', this.lineWidth);

    let x1;
    let x2;
    let y = this.height;

    ctx.beginPath();

    while (drawing) {
      x1 = this.focalPoint - xDif;
      x2 = this.focalPoint + xDif;
      y = this.height - yDif;

      if (xDif == this.focalPoint) {
        yDif += this.offset * 0.3;
        if (yDif >= this.horizonY) {
          drawing = false;
        }
      } else {
        xDif += this.offset;
        if (xDif > this.focalPoint) {
          yDif += (xDif - this.focalPoint) * 0.5;
          xDif = this.focalPoint;
        }
      }

      ctx.moveTo(x1, y);
      ctx.lineTo(this.focalPoint, this.horizonY);
      ctx.lineTo(x2, y);
    }
    while (lineY < this.height) {
      ctx.moveTo(0, lineY);
      ctx.lineTo(this.sideWidth, lineY);
      lineY = Math.round(lineY + lineGapY);
      lineGapY = lineGapY * 1.25;
    }

    ctx.stroke();

    // reset the translation on the ctx for the otehr layers
    if (this.clientCountOnSide) {
      ctx.translate(this.clientIndexOnSide * this.width, 0);
    }
    return [0, this.horizonY, this.width, this.horizonY];
  }
}
