import { style as diffStyle } from '../components/diff.js';
import { style as toolbarStyle } from '../components/toolbar.js';
import { style as versionListStyle } from '../components/version-list.js';
import { style as waiterStyle } from '../components/waiter.js';
import { style as modalStyle } from '../components/modal.js';
import { style as diffListStyle } from '../components/diff-list.js';

export var style = {
  '@keyframes rotate': {
    from: {
      transform: 'rotate(0deg)'
    },
    to: {
      transform: 'rotate(360deg)'
    }
  },

  '@keyframes pop': {
    '0%': {
      transform: 'scale(1, 1)',
      opacity: 1
    },
    '50%': {
      transform: 'scale(0, 0)',
      opacity: 0
    },
    '80%': {
      transform: 'scale(0, 0)',
      opacity: 0
    },
    '100%': {
      transform: 'scale(1, 1)',
      opacity: 1
    }
  },

  '*': {
    boxSizing: 'border-box'
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
    width: '40%',
    height: '100%'
  },
  '.right-panel': {
    display: 'inline-block',
    verticalAlign: 'top',
    height: '100%',
    width: '60%',
    overflow: 'auto'
  },
  ...waiterStyle,
  ...modalStyle,
  ...toolbarStyle,
  ...versionListStyle,
  ...diffStyle,
  ...diffListStyle
}
