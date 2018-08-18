const nodgePercentage = 0.02;
const second = 1000;
const minute = 60 * second;

let beatsPerMinute;
let beatTime;
let barTime;

export function set(bpm) {
  beatsPerMinute = bpm;
  beatTime = bpm / 60 * second;
  barTime = beatTime * 4;
}

export function nodgeUp() {
  set(beatsPerMinute + beatsPerMinute / 100 * nodgePercentage);
}

export function nodgeDown() {
  set(beatsPerMinute - beatsPerMinute / 100 * nodgePercentage);
}

set(130);

export default beatsPerMinute;
