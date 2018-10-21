import { layers, flashLayer } from './layers.mjs';
import { clear, ctx, properties } from './canvas.mjs';

let drawing = true;
const audioLevels = { left: [], right: [] };
export function setAudioLevels({ right, left }) {
  audioLevels.left = left;
  audioLevels.right = right;
}

function drawFrame() {
  clear();

  if (drawing) {
    layers.forEach(l => {
      l.render(ctx, properties, audioLevels);
    });

    flashLayer.render(ctx, properties, audioLevels);

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
