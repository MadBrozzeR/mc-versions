import { Compare } from "./compare.js";

export const style = {
  '.pic-diff': {
    height: '100%',
    paddingBottom: '40px',

    '__content': {
      height: '100%',
    },

    '__compare': {
      height: '100%',
      display: 'flex',
      flexDirection: 'row'
    },

    '__toolbar': {
      marginBottom: '-40px',
      height: '40px'
    },

    ' .compare__panel': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },

    '__toolbar-button': {
      display: 'inline-block',
      margin: '4px',
      cursor: 'pointer',

      ':hover': {
        color: '#aaf'
      }
    }
  }
};

export function PicDiff (params) {
  return mbr.dom('div', { className: 'pic-diff' }, function (block) {
    let ifc = {};
    const pictures = [
        params.src[0] ? mbr.dom('img', { src: params.src[0] }) : null,
        params.src[1] ? mbr.dom('img', { src: params.src[1] }) : null
    ];

    block.append(
      mbr.dom('div', { className: 'pic-diff__content' }, function (content) {
        ifc.sideBySide = function () {
          content.clear().append(
            Compare({ className: 'pic-diff__compare' }, function (left, right) {
              pictures[1] && left.append(pictures[1]);
              pictures[0] && right.append(pictures[0]);
            })
          );
        }
      }),
      mbr.dom('div', { className: 'pic-diff__toolbar' }, function (toolbar) {
        function rescale (multiplier) {
          pictures[0] && (pictures[0].dom.width = pictures[0].dom.naturalWidth * multiplier);
          pictures[1] && (pictures[1].dom.width = pictures[1].dom.naturalWidth * multiplier);
        }

        toolbar.append(
          mbr.dom('div', {
            className: 'pic-diff__toolbar-button',
            innerText: '1x',
            onclick: function () {
              rescale(1);
            }
          }),
          mbr.dom('div', {
            className: 'pic-diff__toolbar-button',
            innerText: '2x',
            onclick: function () {
              rescale(2);
            }
          }),
          mbr.dom('div', {
            className: 'pic-diff__toolbar-button',
            innerText: '4x',
            onclick: function () {
              rescale(4);
            }
          }),
          mbr.dom('div', {
            className: 'pic-diff__toolbar-button',
            innerText: '8x',
            onclick: function () {
              rescale(8);
            }
          })
        );
      })
    );

    ifc.sideBySide();
  });
}
