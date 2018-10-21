const end = Math.PI * 2;

export const name = 'random dots';
export const tags = ['simple', 'singleColor'];
export const parameters = ['color', 'dotCount'];

class Dot {
  constructor(properties, r, g, b) {
    this.x = Math.round(Math.random() * properties.width);
    this.y = Math.round(Math.random() * properties.height);
    const rand = Math.random();
    this.radius = 15 + rand * 25;
    this.sizeStep = 0.01 + rand * 0.07;
    // this.opacity = 0.4 + rand * 0.6;
    this.r = r;
    this.g = g;
    this.b = b;

    this.done = false;
  }

  render(ctx) {
    const { radius } = this;
    if (radius <= 3) {
      this.done = true;
    } else {
      ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, end);
      ctx.fill();
      this.radius -= this.sizeStep * 10;
      // this.opacity -= this.sizeStep;
    }
  }
}

export default class Dots {
  set primary(val) {
    this.dotCount = 1 + Math.round(50 * val);
  }

  get primary() {
    return this.dotCount;
  }

  constructor() {
    this.reset();
    this.dots = [];
  }

  reset() {
    this.r = 256;
    this.g = 256;
    this.b = 256;
    this.dotCount = 1;
  }

  restart() {
    this.dots.length = 0;
  }

  render(ctx, properties) {
    this.dots = this.dots.filter(d => !d.done);

    if (this.dots.length < this.dotCount) {
      let addSoMany = this.dotCount - this.dots.length;
      while (addSoMany > 0) {
        this.dots.push(new Dot(properties, this.r, this.g, this.b));
        addSoMany--;
      }
    }

    this.dots.forEach(d => d.render(ctx));
  }
}
