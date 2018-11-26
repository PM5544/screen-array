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

let lastTimestamp = Date.now();

function drawFrame(ts) {
  clear();
  const frameTime = ts - lastTimestamp;

  if (drawing) {
    layers.forEach(l => {
      l.render(ctx, ts, audioLevels);
    });

    flashLayer.render(ctx);

    window.requestAnimationFrame(drawFrame);

    lastTimestamp = ts;
  }
}

export function start() {
  drawing = true;
  window.requestAnimationFrame(drawFrame);
}

export function stop() {
  drawing = false;
}
