const doc = document;
const body = doc.body;

export const WIDTH = window.screen.width;
export const HEIGHT = window.screen.height;

export function overlay(text) {
  const h1 = document.createElement('h1');
  h1.style.padding = '2rem';
  h1.style.margin = '0';
  h1.style.position = 'absolute';
  h1.style.left = '0';
  h1.style.right = '0';
  h1.style.bottom = '0';
  h1.style.height = 'auto';
  h1.style.background = 'black';
  h1.style.color = 'grey';
  h1.style.fontSize = '4rem';
  h1.style.textAlign = 'center';
  h1.innerHTML = text;
  body.appendChild(h1);

  setTimeout(() => {
    body.removeChild(h1);
  }, 2000);
}

export function reload() {
  doc.location.reload();
}
