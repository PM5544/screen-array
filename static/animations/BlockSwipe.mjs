export const name = 'block swipe';
export const tags = ['simple', 'block', 'singleColor'];
export const properties = ['color', 'frameCount', 'opacity'];

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
    this.frame = 12;
    this.frameCount = 12;
    this.r = 0xff;
    this.g = 0xff;
    this.b = 0xff;
    this.opacity = 1;
  }

  restart() {
    this.frame = 0;
  }

  render(ctx, dimension) {
    if (this.frame < this.frameCount) {
      const { width, height } = dimension;
      const { r, g, b, opacity } = this;
      const halfCount = Math.floor(this.frameCount / 2);

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;

      let left;
      if (this.frame > halfCount) {
        left = width * ((this.frame - halfCount) / halfCount);
      } else {
        left = 0;
      }

      let _width;
      if (this.frame < halfCount) {
        _width = width * this.frame / halfCount;
      } else {
        _width = width;
      }

      ctx.fillRect(left, 0, _width, height);

      this.frame++;
    }
  }
}
