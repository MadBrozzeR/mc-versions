import { Play } from "../player.js";

import { Compare } from './compare.js';

export const style = {
  '.sound-diff': {
    '__line': {
      height: '28px',
      padding: '4px 0',
      whiteSpace: 'nowrap'
    }
  }
};

function SoundLine (params, ref) {
  return mbr.dom('div', { className: 'sound-diff__line' }, function (line) {
    if (params.mode === '000000') {
      line.dom.innerText = 'null';
    } else {
      line.append(
        Play('/res/sound/' + params.name + '?r=' + encodeURIComponent(ref)),
        mbr.dom('span', { innerText: params.name })
      );
    }
  });
}

export function SoundDiff (params) {
  return Compare({ className: 'sound-diff' }, function (left, right) {
    params.changes.forEach(function (change) {
      left.append(SoundLine(change.left, params.refs[0]));
      right.append(SoundLine(change.right, params.refs[1]));
    })
  })
}
