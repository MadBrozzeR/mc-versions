import { ifc } from '../store.js';

export const style = {
  '.modal': {
    width: '200px',
    height:0,
    backgroundColor: '#002',
    border: '1px solid #ddd',
    paddingTop: '24px',
    transition: [
      '.2s width ease-in-out',
      '.2s height ease-in-out',
      '.2s transform ease-in-out'
    ].join(','),
    transform: 'translateY(-200px)',
    overflow: 'hidden',
    maxHeight: '90%',

    '__curtain': {
      opacity: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: '100%',
      right: 0,
      backgroundColor: 'rgba(10, 0, 0, .8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      transition: [
        '.3s opacity ease-in-out',
        '.3s bottom step-end'
      ].join(','),

      '.active': {
        opacity: 1,
        bottom: 0,
        transition: [
          '.3s bottom step-start',
          '.3s opacity ease-in-out'
        ].join(','),

        '.size_s .modal': {
          width: '200px',
          height: '160px'
        },

        '.size_l .modal': {
          width: '1000px',
          height: '600px'
        },

        ' .modal': {
          transform: 'translateY(0)',
        }
      }
    },

    '__head': {
      height: '24px',
      lineHeight: '24px',
      fontSize: '20px',
      padding: '0 24px 0 8px',
      marginTop: '-24px'
    },

    '__title': {
      display: 'inline-block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '100%',
    },

    '__close': {
      display: 'inline-block',
      position: 'absolute',
      lineHeight: '24px',
      width: '24px',
      textAlign: 'center',
      top: 0,
      right: 0,
      cursor: 'pointer'
    },

    '__content': {
      height: '100%',

      ':before': {
        display: 'block',
        content: '""',
        width: '100%',
        padding: '0 10px',
        height: '1px',
        backgroundColor: '#c99',
        backgroundClip: 'content-box',
        boxSizing: 'border-box',
        margin: '0 auto'
      }
    }
  }
};

export function Modal(parent) {
  mbr.dom('div', null, function (curtain) {
    curtain.appendTo(parent);
    var curtainCN = curtain.cn('modal__curtain');
    var blocks = {
      title: null,
      content: null
    };
    var size = 'l';
    var state = '';
    curtainCN.add('size_' + size);

    ifc.modalHide = function (stateToHide) {
      if (!stateToHide || stateToHide === state) {
        curtainCN.del('active');
      }
    }

    ifc.modalShow = function (options, content) {
      options = options || {};
      var newSize = options.size || 'l';

      state = options.state || '';

      if (newSize !== size) {
        curtainCN.del('size_' + size);
        curtainCN.add('size_' + newSize);
        size = newSize;
      }

      blocks.title.dom.innerText = options.title || '';
      blocks.content.clear();
      blocks.content.append(content);
      curtainCN.add('active');
    }

    curtain.append(mbr.dom('div', { className: 'modal' }, function (modal) {
      modal.append(
        mbr.dom('div', { className: 'modal__head' }, function (title) {
          title.append(
            blocks.title = mbr.dom('span', { className: 'modal__title' }),
            mbr.dom('span', {
              className: 'modal__close',
              innerHTML: '&#215;',
              onclick: function () {ifc.modalHide()}
            })
          );
        }),
        blocks.content = mbr.dom('div', { className: 'modal__content' })
      );
    }));
  });
}
