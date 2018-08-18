import { HEIGHT, WIDTH } from './dom.mjs';

const canvas = document.querySelector('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;

export const ctx = canvas.getContext('2d', { alpha: false });

export const properties = {
  width: WIDTH,
  height: HEIGHT,
  centerX: WIDTH / 2,
  centerY: HEIGHT / 2,
  position: {}
};

export function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// ctx.fillStyle = 'white';
// ctx.strokeStyle = '#ffffff';
// ctx.lineWidth = 4;

// function drawFrame() {
//   if (!skipFrame) {
//     skipFrame = true;
//     const bars = levels.length;

//     if (drewFrame && !receivedData) {
//       logger('droppedFrames');
//     }
//     const now = new Date();
//     logger('frameRate', Math.round(1000 / (now - last)));
//     last = now;

//     ctx.clearRect(0, 0, totalWidth, totalHeight);

//     if (0 !== bars) {
//       var barWidth = totalWidth / bars;
//       levels.forEach(function(level, index) {
//         drawBar(level, barWidth, index * barWidth);
//       });
//     }
//     drewFrame = true;
//     receivedData = false;
//   } else {
//     skipFrame = false;
//   }
//   window.requestAnimationFrame(drawFrame);
// }

// let angle = 0;
// const radius = 200;
// const centerX = totalWidth / 2;
// const centerY = totalHeight / 2;

// const circleEnd = Math.PI + Math.PI * 3 / 2;

// function drawFrame() {
//   ctx.fillStyle = backgroundColor;
//   ctx.fillRect(0, 0, totalWidth, totalHeight);
//   ctx.fill();

//   ctx.strokeStyle = '#ffffff';
//   ctx.beginPath();

//   ctx.moveTo(
//     centerX - Math.cos(angle) * radius,
//     centerY - Math.sin(angle) * radius
//   );
//   ctx.lineTo(
//     centerX + Math.cos(angle) * radius,
//     centerY + Math.sin(angle) * radius
//   );
//   ctx.stroke();

//   ctx.beginPath();
//   ctx.arc(centerX, centerY, radius + 10, 0, circleEnd);
//   ctx.stroke();

//   const barWidth = totalWidth / levels.length;
//   let w = 0;
//   ctx.strokeStyle = '#888888';
//   ctx.beginPath();
//   levels.forEach(function(level, index) {
//     const y = totalHeight - totalHeight * level;
//     ctx.moveTo(w, y);
//     w += barWidth;
//     ctx.lineTo(w, y);
//   });
//   ctx.stroke();

//   angle += 0.1;
//   if (angle === 360) {
//     angle = 0;
//   }
//   window.requestAnimationFrame(drawFrame);
// }
// window.requestAnimationFrame(drawFrame);

// function drawBar(level, width, left) {
//   var barHeight = totalHeight * level;
//   ctx.fillRect(left, totalHeight - barHeight, width, barHeight);
// }
