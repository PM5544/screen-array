export const name = 'audioLinesDecay';
export const tags = ['audio', 'simple', 'singleColor'];
export const properties = ['color', 'count', 'opacity'];

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
    this.count = 10;
    this.history = [];
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
      // lineWidth,
      // x,
      // offset,
      position: { index, total = 1, mirrored = false }
    } = this;

    const barsToShow = Math.floor(spectrum.length / total);
    const selectedLevels = spectrum.slice(index * barsToShow, (index + 1) * barsToShow);
    const barWidth = Math.floor(width / selectedLevels.length);
    const halfBarWIdth = barWidth / 2;
    const one = height / 100;

    const { history } = this;

    selectedLevels.forEach((v, i) => {
      if (!history[i]) {
        history[i] = [];
      }
      history[i].unshift(height - v * one);
      if (history[i].length > this.count) {
        history[i].pop();
      }
    });

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
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
