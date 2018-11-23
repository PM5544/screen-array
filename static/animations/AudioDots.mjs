import * as animationUtils from '../utils/animation.mjs';

const circleEnd = Math.PI * 2;

export const name = 'audioDots';
export const tags = ['audio', 'spectrum part'];
export const properties = ['color', 'opacity'];

class Dot {
  constructor ({ ctx, x, y, radius}) {
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

    animationUtils.set(ctx, 'lineWidth', this.lineWidth);
    animationUtils.set(ctx, 'fillStyle', `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`);

    selectedLevels.forEach((v, i) => {
      const x = (barWidth / 2) + (i * barWidth);
      let limit = v;
      let radius = 2;
      new Dot({ ctx, x, y: this.height - limit * one, radius });
      limit -= limit % 5;
      while(limit >= 5){
        radius += 2;
        new Dot({ ctx, x, y: this.height - limit * one, radius });
        limit -= 5;
      }
    });
  }
}
