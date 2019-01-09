const min = 90;
const max = 150;
const minX = 0;
const maxX = 3;
const minY = 82;

const minute = 1000 * 60;
let kickIsOn = false;
let lastKickOn;

let bpms = [];
function getMedian (ar) {
  return ar.reduce((prev, cur) => prev + cur, 0) / ar.length;
}

export default function(left, right) {
  if (kickIsOn) {
    let stillKicking = false;
    for (let current = minX; current <= maxX; current++) {
      if (left[current] >= minY || right[current] >= minY) {
        stillKicking = true;
        break;
      }
    }
    if (!stillKicking) {
      kickIsOn = false;
    }
  } else {
    for (let current = minX; current <= maxX; current++) {
      if (left[current] >= minY || right[current] >= minY) {
        kickIsOn = true;
        const now = Date.now();
        if (lastKickOn) {
          const dif = now - lastKickOn;
          const bpm = minute / dif;

          if (bpm < max && bpm > min) {
            bpms.push(bpm);
            if (bpms.length > 30) {
              bpms.shift();
            }
          }

          // console.log(getMedian(bpms));
        }
        lastKickOn = now;
      }
    }
  }
}
