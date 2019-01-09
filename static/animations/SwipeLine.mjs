import * as animationUtils from '../utils/animation.mjs';
import { lifespan } from '../control/propertyTypes.mjs';
const circleEnd = Math.PI * 2;

export const name = 'swipe line';
export const tags = ['trigger', 'full side'];
export const properties = ['color', 'lifespan', 'lineWidth'];

class Arc {
  constructor(timestamp, swipeLine) {
    this.totalWidth = swipeLine.totalWidth;
    this.clientIsMirrored = swipeLine.clientIsMirrored;
    this.startTimestamp = timestamp;
    this.lifespan = swipeLine.lifespan;
    this.centerY = swipeLine.centerY;
    this.endTimestamp = timestamp + swipeLine.lifespan;
  }

  render(ctx, timestamp) {
    const radius = ((timestamp - this.startTimestamp) / this.lifespan) * this.totalWidth;
    ctx.moveTo(this.clientIsMirrored ? this.totalWidth + radius : radius, this.centerY);
    ctx.arc(this.clientIsMirrored ? this.totalWidth : 0, this.centerY, radius, 0, circleEnd);
  }
}

export default class {
  set primary(val) {
    this.lifespan = val * lifespan.max;
    console.log(this.lifespan);
  }

  get primary() {
    return this.lifespan;
  }

  constructor(...args) {
    animationUtils.extend.call(this, args);
    this.reset();
    this.totalWidth = this.clientCountOnSide * this.width;
  }

  reset() {
    this.lineWidth = 5;
    this.r = 256;
    this.g = 256;
    this.b = 256;
    this.lifespan = 2000;
    this.arcs = [];
  }

  restart() {
    this.addOne = true;
  }

  render(ctx, timestamp) {
    if (this.addOne) {
      this.arcs.unshift(new Arc(timestamp, this));
      this.addOne = false;
    }

    if (this.arcs.length) {
      animationUtils.set(ctx, 'strokeStyle', `rgba(${this.r}, ${this.g}, ${this.b}, 1)`);
      animationUtils.set(ctx, 'lineWidth', this.lineWidth);

      ctx.translate(-(this.clientIndexOnSide * this.width), 0);

      ctx.beginPath();
      const len = this.arcs.length;
      for (let i = 0; i < len; i++) {
        if (this.arcs[i].endTimestamp > timestamp) {
          this.arcs[i].render(ctx, timestamp);
        } else {
          this.arcs.slice(i);
          break;
        }
      }
      ctx.stroke();

      ctx.translate(this.clientIndexOnSide * this.width, 0);
    }
  }
}
