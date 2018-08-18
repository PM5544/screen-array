import { control } from './socket.mjs';
import { trigger } from './events.mjs';

const animationExportProperties = ['name', 'parameters', 'tags'];

let allAnimations = new Map();

control.on('allAnimationPaths', function(animationPaths) {
  Promise.all(
    animationPaths.map(path =>
      import(path).then(module =>
        animationExportProperties.reduce(
          (prev, cur) =>
            Object.assign(prev, {
              [cur]: module[cur]
            }),
          { path, module }
        )
      )
    )
  ).then(data => {
    allAnimations.clear();
    data.forEach(anim => {
      allAnimations.set(anim.path, anim);
    });
    trigger('allAnimationData', data);
  });
});

control.emit('sendAllAnimationPaths');

export default allAnimations;
