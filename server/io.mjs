import io from 'socket.io';
export const IO = io();
export const clientsServer = IO.of('/clients');
export const controlServer = IO.of('/control');
