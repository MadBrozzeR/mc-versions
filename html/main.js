import { Toolbar } from './components/toolbar.js';
import { VersionList } from './components/version-list.js';
import { Modal } from './components/modal.js';
import { style, injectStyle } from './styles/index.js';
import { ifc } from './store.js';

injectStyle({
  '.mainblock': {
    height: '100%',
    padding: '30px 5px 5px'
  },
  '.left-panel': {
    display: 'inline-block',
    width: '20%',
    height: '100%',
    paddingTop: '30px'
  },
  '.right-panel': {
    display: 'inline-block',
    verticalAlign: 'top',
    height: '100%',
    width: '80%',
    overflow: 'auto'
  }
});

window.onload = function () {
  var body = document.getElementsByTagName('body')[0];
  var head = document.getElementsByTagName('head')[0];

  mbr.stylesheet(style, head);

  Modal(body);

  mbr.dom('div', { className: 'mainblock' }, function (mainblock) {
    mainblock.appendTo(body);

    mainblock.append(
      mbr.dom('div', { className: 'left-panel' }, function (leftPanel) {
        leftPanel.append(
          Toolbar(),
          VersionList()
        )
      }),
      mbr.dom('div', { className: 'right-panel' }, function (rightPanel) {
        ifc.rightPanel = function (content) {
          rightPanel.clear().append(content);
        }
      })
    );
  });
};
