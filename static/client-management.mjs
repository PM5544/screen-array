/* globals io */
import { get } from './control/dom.js';

var socket = io('/control');
const clientsNode = get('.clients');

socket.on('allClientIds', function(data) {
  const html = data.clientIds
    .sort()
    .map(
      (id, idx) =>
        `<li><div data-id="${id}">${idx +
          1}</div><input /><button data-id="${id}">set socket number</button></li>`
    )
    .join('');
  clientsNode.innerHTML = `<ul>${html}</ul>`;

  console.log(data.registered);
});

clientsNode.addEventListener('click', ({ target }) => {
  switch (target.nodeName) {
    case 'DIV':
      console.log('div');
      {
        const { id } = target.dataset;
        socket.emit('identify', { targets: 'byId', id, data: { id } });
      }
      break;

    case 'BUTTON':
      console.log('button');
      {
        const socketNumber = get('input', target.parentNode).value;
        const { id } = target.dataset;
        if (socketNumber) {
          console.log('emitted', socketNumber);
          socket.emit('setSocketNumber', {
            id,
            targets: 'byId',
            data: {
              socketNumber: parseInt(socketNumber, 10)
            }
          });
        }
      }
      break;
  }
});

socket.emit('sendAllClientIds');
