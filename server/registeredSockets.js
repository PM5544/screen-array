const { CLIENT_COUNT } = require('./config');

const sockets = new Map();
let socketValues = [];
let socketsRightValues = [];
let socketsLeftValues = [];

const sides = ['left', 'right'];

function reset() {
  socketsRightValues.length = 0;
  socketsLeftValues.length = 0;
}

function getRandomFromArray(ar) {
  return ar[Math.floor(Math.random() * ar.length)];
}

function set(socketNumber, socketId) {
  console.log('sockets', socketNumber, 'set', sockets.size);
  if (!socketNumber) {
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

function one(socketNumber) {
  return sockets.get(socketNumber);
}

function random() {
  return getRandomFromArray(socketValues);
}

function randomFromSide(side = 'right') {
  if ('right' === side) {
    return getRandomFromArray(socketsRightValues);
  } else {
    return getRandomFromArray(socketsLeftValues);
  }
}

function side(side = 'right') {
  if ('right' === side) {
    return socketsRightValues;
  } else {
    return socketsLeftValues;
  }
}

function randomSide() {
  return side(getRandomFromArray(sides));
}

module.exports = {
  one,
  random,
  randomFromSide,
  randomSide,
  reset,
  set,
  side,
  sockets,
  socketsLeftValues,
  socketsRightValues
};
