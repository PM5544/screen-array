const circleEnd = Math.PI * 2;

export const name = 'swipe line';
export const tags = ['simple', 'singleColor'];
export const properties = ['color', 'frameCount', 'lineWidth', 'opacity'];

export default class {
  set primary(val) {
    this.frameCount = 10 + Math.round(val * 50);
  }

  get primary() {
    return this.frameCount;
  }

  constructor(position) {
    this.position = position;
    this.reset();
    this.frame = this.stopFrame;
  }

  reset() {
    this.lineWidth = 5;
    this.r = 256;
    this.g = 256;
    this.b = 256;
    this.opacity = 1;

    this.frameCount = 200;
    this.stopFrame = 230;
  }

  restart() {
    this.frame = 0;
  }

  render(ctx, dimension) {
    if (this.frame === this.stopFrame) {
      return;
    } else if (this.frame < this.frameCount) {
      const { width, height, centerY } = dimension;
      const {
        r,
        g,
        b,
        opacity,
        position: { index, total, mirrored }
      } = this;

      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      ctx.lineWidth = this.lineWidth;

      ctx.translate(-(index * width), 0);

      ctx.beginPath();
      ctx.arc(
        mirrored ? total * width : 0,
        centerY,
        this.frame / this.frameCount * (total * width),
        0,
        circleEnd
      );
      ctx.stroke();

      ctx.translate(index * width, 0);

      this.frame++;
    } else {
      this.frame = this.stopFrame;
    }
  }
}
