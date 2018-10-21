import { qSelect } from './dom.mjs';
import './midi.mjs';
import { getControlParameters, setControlParameters, setAllClientLayers } from './layers.mjs';
import './fullScreen.mjs';
import './clientStatus.mjs';
import './animations.mjs';
import { control } from './socket.mjs';

qSelect('[data-action="refresh"]').addEventListener('click', e => {
  e.preventDefault();
  control.emit('refresh');
  setTimeout(() => {
    control.emit('sendAllClientIds');
  }, 2000);
});

qSelect('[data-action="setAllLayers"]').addEventListener('click', e => {
  e.preventDefault();
  setAllClientLayers();
});

window.onunload = () => {
  void localStorage.setItem('controlParameters', JSON.stringify(getControlParameters()));
};

{
  let controlParameters = localStorage.getItem('controlParameters');
  if (controlParameters) {
    controlParameters = JSON.parse(controlParameters);
    // console.log(controlParameters);
    setControlParameters(controlParameters);
    localStorage.removeItem('controlParameters');
  }
}

// keep track of which keyboard keys are pressed so we can ignore iterations
// const activeKeys = new Map();

// document.body.addEventListener('keydown', ({ which }) => {
//   if (activeKeys.has(which)) {
//     return;
//   }
//   console.log(which);
//   activeKeys.set(which, true);

//   switch (which) {
//     case 65:
//       // socket.emit('changeColor', { data: { color: '#ffffff' } });
//       control.emit('resetLayer', { targets: 'one', data: { layer: 2 } });
//       break;

//     case 81:
//       control.emit('resetLayer', {
//         targets: 'side',
//         id: 'left',
//         data: { layer: 2 }
//       });
//       break;

//     case 83:
//       control.emit('resetLayer', { data: { layer: 2 } });
//       break;

//     case 87:
//       control.emit('resetLayer', {
//         targets: 'randomSide',
//         data: { layer: 2 }
//       });
//       break;

//     case 70:
//       control.emit('flash', { data: { on: true } });
//       break;

//     case 68:
//       control.emit('resetLayer', { data: { layer: 0 } });
//       break;

//     case 69:
//       control.emit('resetLayer', {
//         targets: 'side',
//         id: 'right',
//         data: { layer: 2 }
//       });
//       break;
//   }
// });

// document.body.addEventListener('keyup', ({ which }) => {
//   activeKeys.delete(which);

//   switch (which) {
//     case 65:
//       control.emit('flash', { data: { on: false } });
//       break;

//     case 70:
//       control.emit('flash', { data: { value: 0 } });
//       break;
//   }
// });
