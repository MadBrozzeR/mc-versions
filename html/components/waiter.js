import { ifc } from '../store.js';

export const style = {
  '.waiter': {
    width: '64px',
    height: '64px',
    animation: 'rotate 1s linear infinite',

    '__wrapper': {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    ':before': {
      display: 'block',
      content: '""',
      borderRadius: '50%',
      backgroundColor: '#ddd',
      width: '10px',
      height: '10px',
      margin: '0 auto',
      marginBottom: '44px',
      animation: 'pop .5s linear infinite'
    },

    ':after': {
      display: 'block',
      content: '""',
      borderRadius: '50%',
      backgroundColor: '#ddd',
      width: '10px',
      height: '10px',
      margin: '0 auto',
      animation: 'pop .5s linear .25s infinite'
    }
  }
};

mbr.dom('div', { className: 'waiter__wrapper' }, function (wrapper) {
  wrapper.append(mbr.dom('div', { className: 'waiter' }));

  ifc.waiterShow = function () {
    ifc.modalShow({ title: 'Loading...', size: 's', state: 'waiter' }, wrapper);
  }

  ifc.waiterHide = function () {
    ifc.modalHide('waiter');
  }
});
