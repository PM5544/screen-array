import * as animationUtils from '../utils/animation.mjs';

export const name = 'audioLines';
export const tags = ['audio', 'spectrum part'];
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
    this.reset();
  }

  reset() {
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.opacity = 1;
    this.lineWidth = 2;
  }

  restart() {}

  render(ctx, timestamp, {spectrum = false}) {
    if (!spectrum) {
      return;
    }

    const selectedLevels = animationUtils.getReleventPartOfSpectrum.call(this, spectrum);
    const barWidth = Math.floor(this.width / selectedLevels.length);
    const one = this.height / 100;

    animationUtils.set(ctx, 'strokeStyle', `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`);
    animationUtils.set(ctx, 'lineWidth', this.lineWidth);

    selectedLevels.forEach((v, i) => {
      const h = this.height - v * one;
      ctx.beginPath();
      ctx.moveTo(i * barWidth, h);
      ctx.lineTo((i + 1) * barWidth, h);
      ctx.stroke();
    });
  }
}
