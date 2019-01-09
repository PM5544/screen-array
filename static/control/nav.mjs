const params = new URLSearchParams(document.location.hash);

window.addEventListener('hashchange', e => {
  e.preventDefault();
  console.log(e);
});

function update () {
  document.location.hash = params.toString();
}

export function set (name, value) {
  params.set(name, value);
  update();
}
