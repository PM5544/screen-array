import { spawn } from 'child_process';
import { CLIENT_COUNT } from '../static/constants';

export function shutDownAll() {
  for (let num = 1; num <= CLIENT_COUNT; num++) {
    const connection = spawn('ssh', ['-tt', `pi@r${num}`], { shell: true });

    connection.on('error', err => {
      console.log(`pi@r${num} failed to connect. ${err}`);
    });

    connection.on('close', code => {
      console.log(`pi@r${num} connection closed with code ${code}`);
    });

    connection.stdout.on('data', data => {
      // console.log(data.toString());
    });

    connection.stderr.on('data', data => {
      console.log(`pi@r${num} error: ${data}`);
    });

    connection.stdin.write('sd\n');
    connection.stdin.end();
  };
}

export function restartAll() {
  for (let num = 1; num <= CLIENT_COUNT; num++) {
  const connection = spawn('ssh', ['-tt', `pi@r${num}`], { shell: true });

    connection.on('error', err => {
      console.log(`pi@r${num} failed to connect. ${err}`);
    });

    connection.on('close', code => {
      console.log(`pi@r${num} connection closed with code ${code}`);
    });

    connection.stdout.on('data', data => {
      // console.log(data.toString());
    });

    connection.stderr.on('data', data => {
      console.log(`pi@r${num} error: ${data}`);
    });

    connection.stdin.write('sr\n');
    connection.stdin.end();
  };
}

shutDownAll();

