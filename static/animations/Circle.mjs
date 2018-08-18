const circleEnd = Math.PI * 2;

export const name = 'circle medium';
export const tags = ['simple', 'singleColor'];
export const parameters = ['frameCount', 'lineWidth', 'color', 'opacity'];

export default class {
  set primary(val) {
    this.frameCount = 20 + Math.round(val * 100);
  }

  get primary() {
    return this.frameCount;
  }

  constructor() {
    this.frame = 0;
    this.reset();
  }

  reset() {
    this.maxRadius = 700;
    this.lineWidth = 5;
    this.frameCount = 100;
    this.r = 256;
    this.g = 256;
    this.b = 256;
    this.opacity = 1;
    this.stopFrame = 130;
  }

  restart() {
    this.frame = 0;
  }

  render(ctx, properties) {
    if (this.frame === this.stopFrame) {
      return;
    } else if (this.frame < this.frameCount) {
      const { centerX, centerY } = properties;
      const { r, g, b, opacity } = this;

      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      ctx.lineWidth = this.lineWidth;

      ctx.beginPath();
      ctx.arc(centerX, centerY, this.frame / this.frameCount * this.maxRadius, 0, circleEnd);
      ctx.stroke();

      this.frame++;
    } else {
      this.frame = this.stopFrame;
    }
  }
}
