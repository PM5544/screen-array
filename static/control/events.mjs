const eventsMap = new Map();
const target = {};

export function trigger(type, data) {
  // console.log('triggered', eventsMap.has(type), type, data);
  if (eventsMap.has(type)) {
    eventsMap.get(type).forEach(fn => {
      fn(data);
    });
  }
}

export function listen(type, fn) {
  if (!eventsMap.has(type)) {
    eventsMap.set(type, []);
  }

  eventsMap.get(type).push(fn);

  return function() {
    eventsMap.set(type, eventsMap.get(type).filter(v => v !== fn));
  };
}

// document.addEventListener('click', e => {
//   const { currentTarget, target } = e;
//   console.log(true, currentTarget, target);
// }, true);

document.documentElement.addEventListener('clickedAnimationPreview', ({ detail }) => {
  document.documentElement.dispatchEvent(new CustomEvent('selectedAnimationToLoad', { detail }));
});

export default target;
