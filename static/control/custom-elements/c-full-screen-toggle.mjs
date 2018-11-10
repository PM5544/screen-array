window.customElements.define(
  'c-full-screen-toggle',
  class extends HTMLButtonElement {
    connectedCallback() {
      const toFullScreenText = this.textContent;

      this.addEventListener('click', function toggleFullScreen(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!document.webkitFullscreenElement) {
          e.target.textContent = 'go windowed';
          document.documentElement.webkitRequestFullscreen();
        } else {
          document.webkitExitFullscreen();
          e.target.textContent = toFullScreenText;
        }
      });
    }
  },
  { extends: 'button' }
);
