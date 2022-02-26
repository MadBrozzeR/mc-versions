export var style = {
  '.diff-block': {
    height: '100%',

    '__compare': {
      width: '50%',
      height: '100%',
      overflow: 'auto',
      display: 'inline-block'
    },

    '__line': {
      whiteSpace: 'pre',
      lineHeight: '100%',

      '.changed': {
        backgroundColor: '#700'
      },

      '.empty': {
        backgroundColor: '#000'
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
  DIFF: /@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@\n((?:[+\- ].+\n)+)/g,
  LINE: /([-+])(.+)\n/g
}

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

export function Diff (params) {
  const content = params.content.split('\n');
  const diff = parseDiff(params.diff);

  return mbr.dom('div', { className: 'diff-block' }, function (diffBlock) {
    var left, right;

    diffBlock.append(
      left = mbr.dom('div', { className: 'diff-block__compare' }, function (block) {
        block.dom.onscroll = function () {
          right.dom.scrollTop = left.dom.scrollTop;
          right.dom.scrollLeft = left.dom.scrollLeft;
        }
      }),
      right = mbr.dom('div', { className: 'diff-block__compare' }, function (block) {
        block.dom.onscroll = function () {
          left.dom.scrollTop = right.dom.scrollTop;
          left.dom.scrollLeft = right.dom.scrollLeft;
        }
      })
    );

    let rightIndex = 1;

    for (let index = 0 ; index < content.length ; ++index) {
      let lineNumber = index + 1;

      if (lineNumber in diff) {
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
        left.append(Line({ number: lineNumber, text: content[index]}));
        right.append(Line({ number: rightIndex++, text: content[index]}));
      }
    }
  });
}
