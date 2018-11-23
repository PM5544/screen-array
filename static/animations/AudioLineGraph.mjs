import * as animationUtils from '../utils/animation.mjs';

export const name = 'audioLineGraph';
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
    this.lineWidth = 1;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.opacity = 1;
    this.offset = 250;
    this.x = 0;
  }

  restart() {}

  render(ctx, timestamp, {spectrum = false}) {
    if (!spectrum) {
      return;
    }

    const size = this.width / spectrum.length;
    const one = this.height / 100;

    animationUtils.set(ctx, 'strokeStyle', `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`);
    animationUtils.set(ctx, 'lineWidth', this.lineWidth);

    ctx.beginPath();
    spectrum.forEach((v, i) => {
      ctx.lineTo(i * size, this.height - (v * one));
    });

    ctx.stroke();
  }
}
