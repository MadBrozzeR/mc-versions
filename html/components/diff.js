export var style = {
  '.diff-block': {
    height: '100%',

    '__compare-wrapper': {
      width: '50%',
      height: '100%',
      overflow: 'auto',
      display: 'inline-block'
    },

    '__compare': {
      display: 'inline-block',
      minWidth: '100%'
    },

    '__hider': {
      display: 'block',
      width: '100%',

      '-separator': {
        height: '3px',
        backgroundColor: '#244',
        position: 'relative'
      },

      '-buttons': {
        width: '40px',
        lineHeight: '18px',
        position: 'absolute',
        left: '5px',
        top: '-8px',
        backgroundColor: '#355',
        borderRadius: '9px',
        zIndex: 1,
        textAlign: 'center',
        boxShadow: '0 0 3px 0 #011',
        opacity: 0,
        transition: '.2s opacity ease-in-out'
      },

      '-button': {
        display: 'inline-block',
        padding: '0 2px',
        color: '#ddd',
        cursor: 'pointer',

        ':hover': {
          color: '#bbf'
        }
      },

      ':hover': {
        ' .diff-block__hider-buttons': {
          opacity: 1
        }
      }
    },

    '__line': {
      whiteSpace: 'pre',
      lineHeight: '1.4em',
      fontFamily: 'monospace',

      '.changed': {
        backgroundColor: '#700',
      },

      '.empty': {
        backgroundColor: '#000'
      },

      '.hidden': {
        display: 'none'
      }
    },

    '__line-number': {
      display: 'inline-block',
      width: '50px',
      height: '100%',
      borderRight: '1px dotted #777',
      textAlign: 'right',
      paddingRight: '2px',
      opacity: .6
    },

    '__text': {
      paddingLeft: '8px'
    }
  }
}

const RE = {
  DIFF: /@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(?:.*)\n((?:[+\- ].+[\n\r]+)+)/g,
  LINE: /([-+])(.+)\n/g
}

const HIDER = {
  MIN_UNCHANGED: 3,
  INCREMENT: 5
};

function parseDiff (raw) {
  var regMatch, lineRegMatch;
  var result = {};

  while (regMatch = RE.DIFF.exec(raw)) {
    let leftIndex = parseInt(regMatch[1], 10);
    result[leftIndex] = {
      lines: [],
      replace: []
    };

    while (lineRegMatch = RE.LINE.exec(regMatch[5])) {
      if (lineRegMatch[1] === '-') {
        result[leftIndex].lines.push(lineRegMatch[2]);
      } else if (lineRegMatch[1] === '+'){
        result[leftIndex].replace.push(lineRegMatch[2]);
      }
    }
  }

  return result;
}

function Line ({ number, text, changed } = {}) {
  return mbr.dom('div', null, function (diffLine) {
    var CN = diffLine.cn('diff-block__line');

    if (changed) {
      CN.add('changed');
    } else if (!number && !text) {
      CN.add('empty');
    }

    diffLine.append(
      mbr.dom('span', { className: 'diff-block__line-number', innerText: number || ' ' }),
      mbr.dom('span', { className: 'diff-block__text', innerText: text || '' })
    );
  });
}

function Hider (parent) {
  return mbr.dom('div', { className: 'diff-block__hider' }, function (hider) {
    const items = [];
    let threshold = HIDER.MIN_UNCHANGED
    let hidden = false;
    let inSyncWith = null;

    const separator = mbr.dom('div', { className: 'diff-block__hider-separator' }, function (block) {
      block.append(
        mbr.dom('div', { className: 'diff-block__hider-buttons' }, function (buttons) {
          buttons.append(
            mbr.dom('span', {
              className: 'diff-block__hider-button',
              innerHTML: '&ndash;',
              onclick: function () {
                if (threshold > HIDER.MIN_UNCHANGED) {
                  hider.ifc.eval(- HIDER.INCREMENT);
                  inSyncWith && inSyncWith.ifc.eval(- HIDER.INCREMENT);
                }
              }
            }),
            mbr.dom('span', {
              className: 'diff-block__hider-button',
              innerText: '+',
              onclick: function () {
                hider.ifc.eval(HIDER.INCREMENT);
                inSyncWith && inSyncWith.ifc.eval(HIDER.INCREMENT);
              }
            })
          );
        })
      );
    });

    if (parent) {
      hider.appendTo(parent);
    }

    hider.ifc = {
      push: function (line) {
        items.push(line.cn());
        hider.append(line);
      },
      eval: function (delta) {
        (delta) && (threshold += delta);

        if (hidden) {
          hider.dom.removeChild(separator.dom);
          hidden = false;
        }

        for (let index = 0 ; index < items.length ; ++index) {
          const level = Math.min(index + 1, items.length - index);
          if (level > threshold) {
            if (!hidden) {
              hidden = true;
              items[index].element.parentNode.insertBefore(separator.dom, items[index].element);
            }
            items[index].add('hidden');
          } else {
            items[index].del('hidden');
          }
        }
      },
      syncWith: function (hider) {
        inSyncWith = hider;
      }
    };

    Promise.resolve().then(function () { hider.ifc.eval() });
  });
}

export function Diff () {
  return mbr.dom('div', { className: 'diff-block' }, function (diffBlock) {
    diffBlock.ifc = {
      set: function (params) {
        const content = params.content.split('\n');
        const diff = parseDiff(params.diff);
        var leftWrapper, rightWrapper, left, right;
        let hiders = { left: null, right: null };
        let newHider = true;

        diffBlock.clear().append(
          leftWrapper = mbr.dom('div', { className: 'diff-block__compare-wrapper' }, function (wrapper) {
            wrapper.dom.onscroll = function () {
              rightWrapper.dom.scrollTop = leftWrapper.dom.scrollTop;
              rightWrapper.dom.scrollLeft = leftWrapper.dom.scrollLeft;
            };

            wrapper.append(
              left = mbr.dom('div', { className: 'diff-block__compare' })
            );
          }),
          rightWrapper = mbr.dom('div', { className: 'diff-block__compare-wrapper' }, function (wrapper) {
            wrapper.dom.onscroll = function () {
              leftWrapper.dom.scrollTop = rightWrapper.dom.scrollTop;
              leftWrapper.dom.scrollLeft = rightWrapper.dom.scrollLeft;
            };

            wrapper.append(
              right = mbr.dom('div', { className: 'diff-block__compare' })
            );
          })
        );

        let rightIndex = 1;

        for (let index = 0 ; index < content.length ; ++index) {
          let lineNumber = index + 1;

          if (lineNumber in diff) {
            newHider = true;
            const {lines, replace} = diff[lineNumber];
            index += lines.length - 1;
            let difference = lines.length - replace.length;
            lines.forEach(function (line, index) {
              left.append(Line({ number: lineNumber + index, text: line, changed: true }));
            });
            replace.forEach(function (line) {
              right.append(Line({ number: rightIndex++, text: line, changed: true }));
            });
            if (difference > 0) {
              while (difference--) {
                right.append(Line({ chaned: true }));
              }
            } else if (difference < 0) {
              while (difference++) {
                left.append(Line({ chaned: true }));
              }
            }
          } else {
            if (newHider) {
              hiders.left = Hider(left);
              hiders.right = Hider(right);
              hiders.left.ifc.syncWith(hiders.right);
              hiders.right.ifc.syncWith(hiders.left);
              newHider = false;
            }

            hiders.left.ifc.push(Line({ number: lineNumber, text: content[index]}));
            hiders.right.ifc.push(Line({ number: rightIndex++, text: content[index]}));
          }
        }
      }
    }
  });
}
