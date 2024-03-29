import * as registeredSockets from './registeredSockets';
import { IO, clientsServer } from './io';

export default function(
  type,
  { to = 'clients', targets, id, data = {} } = {}
) {
  // console.log(to, data);
  switch (targets) {
    case 'byId':
      clientsServer.to(id).emit(type, data);
      break;

    case 'one':
      {
        const socketNumber = id;
        const socketId =
          registeredSockets.one(socketNumber) || registeredSockets.random();
        clientsServer.to(socketId).emit(type, data);
      }
      break;

    case 'side':
      // console.log(registeredSockets.side(id));
      registeredSockets.side(id).forEach(socketId => {
        clientsServer.to(socketId).emit(type, data);
      });
      break;

    case 'randomSide':
      // console.log(registeredSockets.randomSide());
      registeredSockets.randomSide().forEach(socketId => {
        clientsServer.to(socketId).emit(type, data);
      });
      break;

    case 'randomFromSide':
      clientsServer.to(registeredSockets.randomFromSide(id)).emit(type, data);
      break;

    default:
      IO.of(to).emit(type, data);
  }
};
