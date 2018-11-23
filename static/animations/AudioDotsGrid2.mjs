import * as animationUtils from '../utils/animation.mjs';

const circleEnd = Math.PI * 2;

export const name = 'audioDotsGrid2';
export const tags = ['audio', 'spectrum part'];
export const properties = ['color', 'opacity'];

class Dot {
  constructor({ ctx, x, y, radius }) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, circleEnd);
    ctx.fill();
  }
}

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
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.opacity = 1;
  }

  restart() {}

  render(ctx, timestamp, {spectrum = false}) {
    if (!spectrum) {
      return;
    }

    const selectedLevels = animationUtils.getReleventPartOfSpectrum.call(this, spectrum);
    const barWidth = Math.floor(this.width / selectedLevels.length);
    const one = this.height / 100;

    animationUtils.set(ctx, 'fillStyle', `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`);

    selectedLevels.forEach((v, i) => {
      const x = barWidth / 2 + i * barWidth;
      let limit = 100;
      let radius = 2;

      if (i !== 0) {
        const x2 = i * barWidth;
        let limit2 = 100;

        while (limit2 >= 5) {
          new Dot({ ctx, x: x2, y: this.height - 5 - limit2 * one, radius: 2 });
          limit2 -= 5;
        }
      }

      while (limit >= 5) {
        if (v >= limit) {
          if (radius === 2) {
            radius = 12;
          } else {
            radius += 3;
          }
        }
        new Dot({ ctx, x, y: this.height - 5 - limit * one, radius });
        limit -= 5;
      }
    });
  }
}
