import * as dom from './dom.mjs';
import { control } from './socket.mjs';

const clientStatus = dom.qSelect('[data-selector=clientStatus]');

clientStatus.addEventListener('click', ({ target }) => {
  const { id } = target.dataset;
  if (id) {
    control.emit('identify', { targets: 'byId', id, data: { id: id.replace('/clients#', '') } });
  }
});

function makeClientIndicator({ id, side }) {
  const client = dom.create('div');
  client.className = `client-indicator ${side}`;
  client.dataset.id = id;
  return client;
}
control.on('allClientIds', function(data) {
  // console.log(data);
  while (clientStatus.childNodes.length) {
    clientStatus.removeChild(clientStatus.firstChild);
  }
  ['left', 'right'].forEach(side => {
    data[side].forEach(id => {
      clientStatus.appendChild(makeClientIndicator({ id, side }));
    });
  });
});

control.emit('sendAllClientIds');
