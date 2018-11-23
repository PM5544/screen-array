import * as animationUtils from '../utils/animation.mjs';

export const name = 'audioBlock';
export const tags = ['audio', 'spectrum part'];
export const properties = ['color', 'opacity'];

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
      ctx.fillRect(i * barWidth, this.height - v * one, barWidth, this.height);
    });
  }
}
