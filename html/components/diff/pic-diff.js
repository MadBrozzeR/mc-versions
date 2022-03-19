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
      height: '40px',

      '-button': {
        display: 'inline-block',
        margin: '4px',
        cursor: 'pointer',

        ':hover': {
          color: '#aaf'
        },

        '.active': {
          color: '#ccf'
        }
      },

      '-separator': {
        display: 'inline-block',
        width: '24px'
      }
    },

    ' .compare__panel': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },

    '__cover': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: '100%',

      '-slider': {
        marginBottom: '24px',
        WebkitAppearance: 'none',
        height: '12px',
        backgroundColor: 'transparent',

        '::-webkit-slider': {
          '-runnable-track': {
            height: '8px',
            backgroundColor: '#011',
            borderRadius: '4px'
          },
          '-thumb': {
            WebkitAppearance: 'none',
            cursor: 'pointer',
            marginTop: '-2px',
            backgroundColor: '#555',
            height: '12px',
            width: '20px',
            borderRadius: '6px',
            border: 'none',

            ':hover': {
              backgroundColor: '#999'
            }
          }
        }
      },

      '-back': {
        position: 'relative',
        backgroundColor: '#022'
      },

      '-front': {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#022',
        minHeight: '100%',
        minWidth: '100%'
      }
    }
  }
};

function ToolbarScaleButton(scale, action) {
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

function ToolbarStyleButton(mode, action) {
  return mbr.dom('div', {
    innerText: mode
  }, function (button) {
    const buttonCN = button.cn('pic-diff__toolbar-button');

    if (picParams.mode.get() === mode) {
      picParams.mode(buttonCN, mode);
    }

    button.dom.onclick = function () {
      picParams.mode(buttonCN, mode);
      action();
    }
  });
}

function ToolbarSeparator() {
  return mbr.dom('div', { className: 'pic-diff__toolbar-separator' });
}

function CoverDiff (pictures) {
  let front;

  return mbr.dom('div', { className: 'pic-diff__cover' }, function (block) {
    block.append(
      mbr.dom('input', {
        className: 'pic-diff__cover-slider',
        type: 'range',
        min: 0,
        max: 1,
        step: 0.02
      }, function (slider) {
        slider.dom.oninput = function () {
          front && (front.dom.style.opacity = this.value);
        }
      }),
      mbr.dom('div', { className: 'pic-diff__cover-back' }, function (back) {
        back.append(
          pictures.wrappers[0]
        );

        back.append(
          front = mbr.dom('div', { className: 'pic-diff__cover-front' }, function (front) {
            front.append(pictures.wrappers[1])
          })
        );
      })
    )
  })
}

function Pictures(picture1, picture2, scale) {
  const _this = this;

  function rescale() {
    scale && _this.rescale(scale)
  }

  const pictures = this.pictures = [
    picture1 ? mbr.dom('img', { src: picture1, onload: rescale }) : null,
    picture2 ? mbr.dom('img', { src: picture2, onload: rescale }) : null,
  ];

  this.wrappers = [
    mbr.dom('div', { className: 'pic-diff__image-wrapper' }, function (wrapper) {
      pictures[0] && wrapper.append(pictures[0]);
    }),
    mbr.dom('div', { className: 'pic-diff__image-wpapper' }, function (wrapper) {
      pictures[1] && wrapper.append(pictures[1]);
    })
  ]
}

Pictures.prototype.rescale = function (scale) {
  this.pictures.forEach(function (picture) {
    picture && (picture.dom.width = picture.dom.naturalWidth * scale);
  });

  const maxWidth = Math.max(
    this.pictures[0] ? this.pictures[0].dom.naturalWidth : 0,
    this.pictures[1] ? this.pictures[1].dom.naturalWidth : 0
  ) * scale;
  const maxHeight = Math.max(
    this.pictures[0] ? this.pictures[0].dom.naturalHeight : 0,
    this.pictures[1] ? this.pictures[1].dom.naturalHeight : 0
  ) * scale;

  this.wrappers[0].dom.style.width = this.wrappers[1].dom.width = maxWidth + 'px';
  this.wrappers[1].dom.style.height = this.wrappers[1].dom.height = maxHeight + 'px';
}

export function PicDiff (params) {
  return mbr.dom('div', { className: 'pic-diff' }, function (block) {
    let ifc = {};
    const pictures = new Pictures(params.src[0], params.src[1], picParams.scale.get());

    function rescale() {
      const scale = picParams.scale.get();

      pictures.rescale(scale);
    }

    function changeMode () {
      switch (picParams.mode.get()) {
        case 'SBS':
          ifc.sideBySide();
          break;
        case 'CV':
          ifc.cover();
          break;
      }
    }

    block.append(
      mbr.dom('div', { className: 'pic-diff__content' }, function (content) {
        ifc.sideBySide = function () {
          content.clear().append(
            Compare({ className: 'pic-diff__compare' }, function (left, right) {
              left.append(pictures.wrappers[0]);
              right.append(pictures.wrappers[1]);
            })
          );
        }

        ifc.cover = function () {
          content.clear().append(CoverDiff(pictures))
        }
      }),
      mbr.dom('div', { className: 'pic-diff__toolbar' }, function (toolbar) {
        toolbar.append(
          ToolbarScaleButton(1, rescale),
          ToolbarScaleButton(2, rescale),
          ToolbarScaleButton(4, rescale),
          ToolbarScaleButton(8, rescale),
          ToolbarSeparator(),
          ToolbarStyleButton('SBS', changeMode),
          ToolbarStyleButton('CV', changeMode)
        );
      })
    );


    changeMode();
  });
}
