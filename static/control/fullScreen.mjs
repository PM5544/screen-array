import { qSelect } from './dom.mjs';

const button = qSelect('[data-action=fullScreen]');

const toWindowedText = button.dataset.toggledText;
const toFullScreenText = button.textContent;

button.addEventListener('click', function toggleFullScreen({ target }) {
  if (!document.webkitFullscreenElement) {
    target.textContent = toWindowedText;
    document.documentElement.webkitRequestFullscreen();
  } else {
    document.webkitExitFullscreen();
    target.textContent = toFullScreenText;
  }
});
