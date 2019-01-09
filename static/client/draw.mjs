import { layers, flashLayer } from './layers.mjs';
import { clear, ctx } from './canvas.mjs';

const { requestAnimationFrame } = window;

let drawing = true;
let audioLevels = {
  spectrum: []
};

export function setAudioLevels(data) {
  audioLevels = data;
}

// let lastTimestamp = Date.now();

function drawFrame(ts) {
  clear();
  // const frameTime = ts - lastTimestamp;

  if (drawing) {
    layers.forEach(l => {
      l.render(ctx, ts, audioLevels);
    });

    flashLayer.render(ctx);

    requestAnimationFrame(drawFrame);

    // lastTimestamp = ts;
  }
}

export function start() {
  drawing = true;
  requestAnimationFrame(drawFrame);
}

export function stop() {
  drawing = false;
}
