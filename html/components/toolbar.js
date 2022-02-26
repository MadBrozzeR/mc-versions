import { get, fetcher } from '../fetchers.js'
import { ifc, selectedVersions } from '../store.js';

export const style = {
  '.toolbar': {
    marginTop: '-24px',
    height: '24px',

    '-button': {
      height: '100%',
      border: '1px solid #ddd',
      borderRadius: '3px',
      backgroundColor: '#777'
    }
  }
};

export function Toolbar() {
  return mbr.dom('div', { className: 'toolbar' }, function (buttons) {
    buttons.append(
      mbr.dom('button', {className: 'toolbar-button', innerText: 'Diff'}, function (diffButton) {
        diffButton.on({
          click: function () {
            fetcher(
              get.diff({
                first: selectedVersions.first.get(),
                second: selectedVersions.second.get()
              }),
              (response) => ifc.difflist(response)
            )
          }
        })
      })
    )
  });
}
