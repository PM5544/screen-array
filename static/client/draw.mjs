import { layers, flashLayer } from './layers.mjs';
import { clear, ctx } from './canvas.mjs';

const initialisationTimestamp = Date.now();
let drawing = true;
const audioLevels = {
  spectrum: []
};

export function setAudioLevels({spectrum}) {
  audioLevels.spectrum = spectrum;
}

function drawFrame() {
  clear();
  const timestamp = Date.now() - initialisationTimestamp;

  if (drawing) {
    layers.forEach(l => {
      l.render(ctx, timestamp, audioLevels);
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
