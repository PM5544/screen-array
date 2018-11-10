const circleEnd = Math.PI * 2;

export const name = 'audioDots';
export const tags = ['audio', 'simple', 'singleColor'];
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

    const barsToShow = Math.floor(spectrum.length / total);
    const selectedLevels = spectrum.slice(index * barsToShow, (index + 1) * barsToShow);
    const barWidth = Math.floor(width / selectedLevels.length);
    const one = height / 100;

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    selectedLevels.forEach((v, i) => {
      const x = (barWidth / 2) + (i * barWidth);
      let limit = v;
      let radius = 2;
      new Dot({ ctx, x, y: height - limit * one, radius });
      limit -= limit % 5;
      while(limit >= 5){
        radius += 2;
        new Dot({ ctx, x, y: height - limit * one, radius });
        limit -= 5;
      }
    });
  }
}
