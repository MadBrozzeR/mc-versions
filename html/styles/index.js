import { keyframes } from './animation.js';
import { scrollbars } from './scrollbars.js';
import { style as diffStyle } from '../components/diff.js';
import { style as versionListStyle } from '../components/version-list.js';
import { style as waiterStyle } from '../components/waiter.js';
import { style as modalStyle } from '../components/modal.js';
import { style as diffListStyle } from '../components/diff-list.js';
import { style as diffPaneStyle } from '../components/diff-pane.js';
import { style as logStyle } from '../components/log.js';
import { style as playerStyle } from '../components/player.js';
import { style as diffTypesStyle } from '../components/diff/index.js';
import { style as treeStyle } from '../components/tree.js';

export var style = {
  ...keyframes,

  '*': {
    boxSizing: 'border-box',

    ...scrollbars
  },
  'html': {
    height: '100%'
  },
  'body': {
    backgroundColor: '#022',
    color: '#eee',
    margin: 0,
    height: '100%'
  },
  'img': {
    imageRendering: 'pixelated'
  },
  ...waiterStyle,
  ...modalStyle,
  ...toolbarStyle,
  ...versionListStyle,
  ...diffStyle,
  ...diffListStyle,
  ...diffPaneStyle,
  ...logStyle,
  ...playerStyle,
  ...diffTypesStyle,
  ...treeStyle,
};

export function injectStyle (newStyles) {
  for (const key in newStyles) {
    style[key] = newStyles[key];
  }
}
