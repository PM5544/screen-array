import { layers, flashLayer } from './layers.mjs';
import { clear, ctx, dimensions } from './canvas.mjs';

let drawing = true;
const audioLevels = {
  spectrum: []
};

export function setAudioLevels({spectrum}) {
  audioLevels.spectrum = spectrum;
}

function drawFrame() {
  clear();

  if (drawing) {
    layers.forEach(l => {
      l.render(ctx, dimensions, audioLevels);
    });

    flashLayer.render(ctx, dimensions, audioLevels);

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
