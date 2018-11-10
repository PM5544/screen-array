import { HEIGHT, WIDTH } from './dom.mjs';

const canvas = document.querySelector('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;

export const ctx = canvas.getContext('2d', { alpha: false });

export const dimensions = {
  width: WIDTH,
  height: HEIGHT,
  centerX: WIDTH / 2,
  centerY: HEIGHT / 2,
  position: {}
};

export function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}
