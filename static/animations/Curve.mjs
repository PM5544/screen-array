export const name = 'curve';
export const tags = ['simple', 'singleColor'];
export const parameters = ['height', 'stepSize', 'lineWidth', 'color', 'opacity'];

export default class {
  set primary(val) {
    this.opacity = val;
  }

  get primary() {
    return this.opacity;
  }

  constructor() {
    this.reset();
  }

  reset() {
    this.height = 250;
    this.stepSize = 1;
    this.lineWidth = 5;
    this.offset = 0;
    this.r = 256;
    this.g = 256;
    this.b = 256;
    this.opacity = 1;
  }

  restart() {
    this.offset = 0;
  }

  render(ctx, properties) {
    const { foregroundColor, centerX, centerY, width } = properties;
    const { r, g, b, opacity, offset } = this;
    const partX = width / 2;

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    ctx.lineWidth = this.lineWidth;

    // ctx.moveTo(this.offSet - width, centerY);
    ctx.beginPath();
    ctx.moveTo(offset - width, centerY);

    ctx.bezierCurveTo(
      -offset - width + partX,
      centerY - this.height,
      -offset - partX,
      centerY + this.height,
      -offset,
      centerY
    );
    ctx.bezierCurveTo(
      -offset + partX,
      centerY - this.height,
      -offset + width - partX,
      centerY + this.height,
      -offset + width,
      centerY
    );
    ctx.bezierCurveTo(
      -offset + width + partX,
      centerY - this.height,
      -offset + width + width - partX,
      centerY + this.height,
      -offset + width + width,
      centerY
    );
    ctx.stroke();

    this.offset += this.stepSize;
    if (this.offset > width) {
      this.offset -= width;
    }
  }
}
