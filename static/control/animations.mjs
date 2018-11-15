import { control } from './socket.mjs';
import { trigger } from './events.mjs';

const animationExportProperties = ['name', 'properties', 'tags'];

let allAnimations = new Map();

control.on('allAnimationPaths', function(animationPaths) {
  Promise.all(
    animationPaths.map(specifier =>
      import(specifier).then(module =>
        animationExportProperties.reduce(
          (prev, cur) =>
            Object.assign(prev, {
              [cur]: module[cur]
            }),
          { specifier, module }
        )
      )
    )
  ).then(data => {
    allAnimations.clear();
    data.forEach(anim => {
      allAnimations.set(anim.specifier, anim);
    });
    trigger('allAnimationData', data);
  });
});

control.emit('sendAllAnimationPaths');

export default allAnimations;
