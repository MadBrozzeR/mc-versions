import { keyframes } from './animation.js';
import { style as diffStyle } from '../components/diff.js';
import { style as toolbarStyle } from '../components/toolbar.js';
import { style as versionListStyle } from '../components/version-list.js';
import { style as waiterStyle } from '../components/waiter.js';
import { style as modalStyle } from '../components/modal.js';
import { style as diffListStyle } from '../components/diff-list.js';
import { style as diffPaneStyle } from '../components/diff-pane.js';

export var style = {
  ...keyframes,

  '*': {
    boxSizing: 'border-box',

    '::-webkit-scrollbar': {
      width: '6px',

      '-track': {
        backgroundColor: '#011',
        borderRadius: '3px'
      },

      '-thumb': {
        backgroundColor: '#555',
        borderRadius: '3px'
      }
    }
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
  '.mainblock': {
    height: '100%',
    padding: '60px 5px 5px'
  },
  '.left-panel': {
    display: 'inline-block',
    width: '20%',
    height: '100%'
  },
  '.right-panel': {
    display: 'inline-block',
    verticalAlign: 'top',
    height: '100%',
    width: '80%',
    overflow: 'auto'
  },
  ...waiterStyle,
  ...modalStyle,
  ...toolbarStyle,
  ...versionListStyle,
  ...diffStyle,
  ...diffListStyle,
  ...diffPaneStyle,
};
