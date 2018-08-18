import layers, { flashLayer } from './layers.mjs';
import { clear, ctx, properties } from './canvas.mjs';

let drawing = true;

function drawFrame() {
  clear();

  if (drawing) {
    layers.forEach(l => {
      l.render(ctx, properties);
    });

    flashLayer.render(ctx, properties);

    window.requestAnimationFrame(drawFrame);
  }
}

export function start() {
  drawing = true;
  window.requestAnimationFrame(drawFrame);
}

export function stop() {
  drawing = false;
}
