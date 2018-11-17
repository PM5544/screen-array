import * as animationUtils from '../utils/animation.mjs';

const circleEnd = Math.PI * 2;

export const name = 'audioDotsGrid';
export const tags = ['audio', 'simple', 'singleColor'];
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

  render(ctx, {spectrum = false}) {
    if (!spectrum) {
      return;
    }


    const barsToShow = Math.floor(spectrum.length / this.clientCountOnSide);
    const selectedLevels = spectrum.slice(this.clientIndexOnSide * barsToShow, (this.clientIndexOnSide + 1) * barsToShow);
    const barWidth = Math.floor(this.width / selectedLevels.length);
    const one = this.height / 100;

    ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`;

    // console.log(selectedLevels);

    selectedLevels.forEach((v, i) => {
      const x = barWidth / 2 + i * barWidth;
      let limit = 100;
      let radius = 2;

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
