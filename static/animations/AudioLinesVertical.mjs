import * as animationUtils from '../utils/animation.mjs';

export const name = 'audioLinesVertical';
export const tags = ['audio', 'spectrum part'];
export const properties = ['color', 'opacity', 'barWidth'];

class Line {
  constructor({ ctx, x, w, h }) {
    ctx.fillRect(x - w / 2, 0, w, h);
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
    this.barWidth = 20;
    this.opacity = 1;
  }

  restart() {}

  render(ctx, {spectrum = false}) {
    if (!spectrum) {
      return;
    }

    const selectedLevels = animationUtils.getReleventPartOfSpectrum.call(this, spectrum);
    const sectionWidth = Math.floor(this.width / selectedLevels.length);
    const lineCount = Math.round(sectionWidth / this.barWidth);
    const maxWidth = sectionWidth / lineCount;

    ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`;

    let x = maxWidth / 2;
    selectedLevels.forEach(v => {
      const w = (maxWidth / 100) * v;
      let counter = lineCount;
      while(counter){
        new Line({ ctx, x, h: this.height, w });
        counter--;
        x += maxWidth;
      }
    });
  }
}
