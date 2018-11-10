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

  constructor(position) {
    this.position = position;
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

  render(ctx, dimension, {spectrum = false}) {
    if (!spectrum) {
      return;
    }

    const { width, height } = dimension;
    const {
      r,
      g,
      b,
      opacity,
      lineWidth,
      position: { index, total = 1 }
    } = this;

    const barsToShow = Math.floor(spectrum.length / total);
    const selectedLevels = spectrum.slice(index * barsToShow, (index + 1) * barsToShow);
    const barWidth = Math.floor(width / selectedLevels.length);
    const one = height / 100;

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    ctx.lineWidth = lineWidth;

    selectedLevels.forEach((v, i) => {
      const h = height - v * one;
      ctx.beginPath();
      ctx.moveTo(i * barWidth, h);
      ctx.lineTo((i + 1) * barWidth, h);
      ctx.stroke();
    });
  }
}
