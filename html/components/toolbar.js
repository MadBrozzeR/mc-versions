import { ifc } from '../store.js';
import { DiffPane } from './diff-pane.js';
import { injectStyle } from '../styles/index.js';

injectStyle({
  '.toolbar': {
    margin: '-30px 0 6px',
    height: '24px',

    '-button': {
      height: '100%',
      border: '1px solid #ddd',
      borderRadius: '3px',
      backgroundColor: '#777'
    }
  }
});

export function Toolbar() {
  return mbr.dom('div', { className: 'toolbar' }, function (buttons) {
    buttons.append(
      mbr.dom('button', {className: 'toolbar-button', innerText: 'Diff'}, function (diffButton) {
        diffButton.on({
          click: function () {
            ifc.rightPanel(DiffPane());
          }
        })
      })
    )
  });
}
