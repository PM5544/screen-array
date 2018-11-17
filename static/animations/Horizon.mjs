import * as animationUtils from '../utils/animation.mjs';

export const name = 'horizon';
export const tags = ['simple', 'singleColor'];
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

    // clientIndexOnSide
    // clientCountOnSide
    this.clientCountOnSideWidth = this.clientCountOnSide * this.width;
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
    let lineY = this.centerY;
    const horizonY = lineY;

    if (this.clientCountOnSide) {
      ctx.translate(-(this.clientIndexOnSide * this.width), 0);
    }

    ctx.beginPath();
    ctx.lineWidth = this.lineWidth;

    const focalPoint = Math.round(this.clientCountOnSideWidth / 2);

    let drawing = true;
    let xDif = 0;
    let yDif = 0;

    ctx.strokeStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`;

    let x1;
    let x2;
    let y = this.height;

    while (drawing) {
      ctx.beginPath();
      x1 = focalPoint - xDif;
      x2 = focalPoint + xDif;
      y = this.height - yDif;

      if (xDif == focalPoint) {
        yDif += this.offset * 0.3;
        if (yDif >= horizonY) {
          drawing = false;
        }
      } else {
        xDif += this.offset;
        if (xDif > focalPoint) {
          yDif += (xDif - focalPoint) * 0.5;
          xDif = focalPoint;
        }
      }

      ctx.moveTo(x1, y);
      ctx.lineTo(focalPoint, horizonY);
      ctx.lineTo(x2, y);
      ctx.stroke();
    }

    // ctx.moveTo(focalPoint, horizonY);
    // ctx.beginPath();
    // ctx.fillStyle = '#000000';
    // ctx.lineWidth = 0;
    // ctx.strokeStyle = '#000000';
    // ctx.arc(focalPoint, horizonY, 5, 0, Math.PI);
    // ctx.fill();

    // ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
    // let horizontalColor = 0;
    while (lineY < this.height) {
      // if (horizontalColor > 256) {
      //   ctx.strokeStyle = 'rgb(256, 256, 256)';
      // } else {
      //   ctx.beginPath();
      //   ctx.strokeStyle = `rgb(${horizontalColor}, ${horizontalColor}, ${horizontalColor})`;
      //   horizontalColor += 60;
      // }
      ctx.moveTo(0, lineY);
      ctx.lineTo(this.clientCountOnSideWidth, lineY);
      lineY = Math.round(lineY + lineGapY);
      lineGapY = lineGapY * 1.25;
    }

    ctx.stroke();
    // ctx.stroke();

    // if (clientIsMirrored) {
    //   this.x += this.offset;
    //   if (this.x > lineGapX) {
    //     this.x -= lineGapX;
    //   }
    // } else {
    //   this.x -= this.offset;
    //   if (this.x < -lineGapX) {
    //     this.x += lineGapX;
    //   }
    // }

    // ctx.beginPath();
    // if (clientIsMirrored) {
    //   ctx.moveTo(0, 0);
    //   ctx.lineTo(this.clientCountOnSide * width, height);
    // } else {
    //   ctx.moveTo(this.clientCountOnSide * width, 0);
    //   ctx.lineTo(0, height);
    // }
    // ctx.stroke();
    if (this.clientCountOnSideWidth) {
      ctx.translate(this.clientIndexOnSide * this.width, 0);
    }
  }
}
