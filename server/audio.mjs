import { spawn } from 'child_process';
import sendToSockets from './sendToSockets.mjs';
import analyse from './audioAnalyser.mjs';
import beatsPerMinuteCalculator from './utils/beatsPerMinuteCalculator.mjs';

const audio = spawn('ssh', ['pi@audio', 'projects/cava/cava']);
const audioValuesCount = 30;
const audioValuesCountPerSide = audioValuesCount / 2;
const lineFeed = '\n';
const int = v => parseInt(v, 10);


function parse(value) {
  const levels = value.split(';').map(int);
  const right = levels.splice(audioValuesCountPerSide);
  // const left = levels;
  const left = levels.reverse();

  const analised = analyse(left, right);
  beatsPerMinuteCalculator(left, right);
  // console.log(analised);
  // console.log('---');
  // console.log('L', levels.reverse());
  // console.log('R', right);
  sendToSockets('audioSpectrumValues', {
    targets: 'side',
    id: 'right',
    data: {
      ...analised.right,
      spectrum: right
    }
  });
  sendToSockets('audioSpectrumValues', {
    targets: 'side',
    id: 'left',
    data: {
      ...analised.left,
      spectrum: left
    }
  });
}

audio.on('error', err => {
  console.log('Failed to start audio subprocess.');
  audio.kill();
});

audio.on('close', code => {
  console.log(`audio child process exited with code ${code}`);
});

let temp = '';
audio.stdout.on('data', data => {
  const received = data.toString();
  temp += received;
  if (received.endsWith(lineFeed)) {
    parse(temp.replace(';\n', ''));
    temp = '';
  }
});

audio.stderr.on('data', data => {
  console.log(`error: ${data}`);
});
