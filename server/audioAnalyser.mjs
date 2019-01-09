const functionMap = new Map();

const analisers = {
  kick: {
    type: 'on-off',
    boundaries: [0, 3, 82, 100]
  },
  snare: {
    type: 'on-off',
    boundaries: [9, 12, 50, 100]
  }
};

function analyse(levels, { type, boundaries: [minX, maxX, minY, maxY] }) {
  switch (type) {
    case 'on-off':
      for (let current = minX; current <= maxX; current++) {
        if (levels[current] >= minY) {
          return 100;
        }
      }
      return 0;
  }
}

export default function(leftLevels, rightLevels) {
  const left = {};
  const right = {};

  Object.keys(analisers).forEach(key => {
    const settings = analisers[key];
    left[key] = analyse(leftLevels, settings);
    right[key] = analyse(rightLevels, settings);
  });

  return {
    left,
    right
  };
}
