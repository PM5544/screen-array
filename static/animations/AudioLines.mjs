import * as animationUtils from '../utils/animation.mjs';

export const name = 'audioLines';
export const tags = ['audio', 'simple', 'singleColor'];
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

  render(ctx, {spectrum = false}) {
    if (!spectrum) {
      return;
    }

    const barsToShow = Math.floor(spectrum.length / this.clientCountOnSide);
    const selectedLevels = spectrum.slice(this.clientIndexOnSide * barsToShow, (this.clientIndexOnSide + 1) * barsToShow);
    const barWidth = Math.floor(this.width / selectedLevels.length);
    const one = this.height / 100;

    ctx.strokeStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`;
    ctx.lineWidth = this.lineWidth;

    selectedLevels.forEach((v, i) => {
      const h = this.height - v * one;
      ctx.beginPath();
      ctx.moveTo(i * barWidth, h);
      ctx.lineTo((i + 1) * barWidth, h);
      ctx.stroke();
    });
  }
}
