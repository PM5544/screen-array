export const name = 'audioLinesVertical';
export const tags = ['audio', 'simple', 'singleColor'];
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

  constructor(position) {
    this.position = position;
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
      barWidth,
      position: { index, total = 1, mirrored = false }
    } = this;

    const barsToShow = Math.floor(spectrum.length / total);
    const selectedLevels = spectrum.slice(index * barsToShow, (index + 1) * barsToShow);
    const sectionWidth = Math.floor(width / selectedLevels.length);
    const lineCount = Math.round(sectionWidth / barWidth);
    const maxWidth = sectionWidth / lineCount;

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    // console.log(selectedLevels);
    let x = maxWidth / 2;
    selectedLevels.forEach(v => {
      const w = (maxWidth / 100) * v;
      let counter = lineCount;
      while(counter){
        new Line({ ctx, x, h: height, w });
        counter--;
        x += maxWidth;
      }
    });
  }
}
