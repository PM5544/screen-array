import { CLIENT_COUNT } from '../static/constants';

export const sockets = new Map();
export let socketValues = [];
export let socketsRightValues = [];
export let socketsLeftValues = [];

const sides = ['left', 'right'];

export function reset() {
  socketsRightValues.length = 0;
  socketsLeftValues.length = 0;
}

function getRandomFromArray(ar) {
  return ar[Math.floor(Math.random() * ar.length)];
}

export function set(socketNumber, socketId) {
  console.log('sockets', socketNumber, 'set', sockets.size, socketId);
  if (!socketNumber) {
    return;
  }

  if ('control' === socketNumber) {
    return;
  }

  sockets.set(socketNumber, socketId);
  socketValues = Array.from(sockets.values());

  const { size } = sockets;

  if (size === CLIENT_COUNT) {
    reset();

    const half = size / 2;
    let counter = half;

    while (counter >= 1) {
      socketsLeftValues.push(sockets.get('' + counter));
      socketsRightValues.push(sockets.get('' + (size + 1 - counter)));
      counter--;
    }

    socketsLeftValues.reverse();

    //     console.log(
    //       `Sockets sorted by side,
    // left items (${socketsLeftValues.length}):\n\t${socketsLeftValues.join(',\n\t')}.
    // right items (${socketsRightValues.length}):\n\t${socketsRightValues.join(
    //         ',\n\t'
    //       )}.`
    //     );
  }
}

export function one(socketNumber) {
  return sockets.get(socketNumber);
}

export function random() {
  return getRandomFromArray(socketValues);
}

export function randomFromSide(side = 'right') {
  if ('right' === side) {
    return getRandomFromArray(socketsRightValues);
  } else {
    return getRandomFromArray(socketsLeftValues);
  }
}

export function side(side = 'right') {
  if ('right' === side) {
    return socketsRightValues;
  } else {
    return socketsLeftValues;
  }
}

export function randomSide() {
  return side(getRandomFromArray(sides));
}
