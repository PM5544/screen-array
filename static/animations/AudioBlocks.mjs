export const name = 'audioBlock';
export const tags = ['audio', 'simple', 'singleColor'];
export const properties = ['color', 'opacity'];

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
      position: { index, total = 1, mirrored = false }
    } = this;

    // console.log(index, total, mirrored);

    const barsToShow = Math.floor(spectrum.length / total);
    const selectedLevels = spectrum.slice(index * barsToShow, (index + 1) * barsToShow );
    const barWidth = Math.floor(width / selectedLevels.length);
    const one = height / 100;

    // console.log(selectedLevels);

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    selectedLevels.forEach((v, i) => {
      ctx.fillRect(i * barWidth, height - v * one, barWidth, height);
    });
  }
}
