import { layers, flashLayer } from './layers.mjs';
import { clear, ctx } from './canvas.mjs';

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
      l.render(ctx, audioLevels);
    });

    flashLayer.render(ctx);

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
