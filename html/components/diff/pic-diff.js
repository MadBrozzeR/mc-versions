import { Compare } from "./compare.js";
import { picParams } from '../../store.js';

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
      },

      '.active': {
        color: '#ccf'
      }
    }
  }
};

function ToolbarButton(scale, action) {
  return mbr.dom('div', {
    innerText: scale + 'x'
  }, function (button) {
    const buttonCN = button.cn('pic-diff__toolbar-button');

    if (picParams.scale.get() === scale) {
      picParams.scale(buttonCN, scale);
    }

    button.dom.onclick = function () {
      picParams.scale(buttonCN, scale);
      action();
    }
  })
}

export function PicDiff (params) {
  return mbr.dom('div', { className: 'pic-diff' }, function (block) {
    let ifc = {};
    const pictures = [
        params.src[0] ? mbr.dom('img', { src: params.src[0], onload: rescale }) : null,
        params.src[1] ? mbr.dom('img', { src: params.src[1], onload: rescale }) : null
    ];

    function rescale() {
      const scale = picParams.scale.get();

      pictures.forEach(function (picture) {
        picture && (picture.dom.width = picture.dom.naturalWidth * scale);
      });
    }

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
        toolbar.append(
          ToolbarButton(1, rescale),
          ToolbarButton(2, rescale),
          ToolbarButton(4, rescale),
          ToolbarButton(8, rescale)
        );
      })
    );


    ifc.sideBySide();
  });
}
