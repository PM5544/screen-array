import * as animationUtils from '../utils/animation.mjs';

export const name = 'audioLinesDecay';
export const tags = ['audio', 'spectrum part'];
export const properties = ['color', 'count', 'opacity'];

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
    this.count = 10;
    this.history = [];
  }

  restart() {}

  render(ctx, {spectrum = false}) {
    if (!spectrum) {
      return;
    }

    const selectedLevels = animationUtils.getReleventPartOfSpectrum.call(this, spectrum);
    const barWidth = Math.floor(this.width / selectedLevels.length);
    const halfBarWIdth = barWidth / 2;
    const one = this.height / 100;

    const { history } = this;

    selectedLevels.forEach((v, i) => {
      if (!history[i]) {
        history[i] = [];
      }
      history[i].unshift(this.height - v * one);
      if (history[i].length > this.count) {
        history[i].pop();
      }
    });

    ctx.strokeStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`;
    ctx.lineWidth = this.lineWidth;

    history.forEach((bar, barIndex) => {
      const center = barIndex * barWidth + halfBarWIdth;
      bar.forEach((h, i) => {
        const w = halfBarWIdth - (halfBarWIdth / this.count) * i;
        ctx.beginPath();
        ctx.moveTo(center - w, h + i * one);
        ctx.lineTo(center + w, h + i * one);
        ctx.stroke();
      });
    });
  }
}
