import { DiffList } from './components/diff-list.js';
import { Toolbar } from './components/toolbar.js';
import { VersionList } from './components/version-list.js';
import { Modal } from './components/modal.js';
import { style } from './src/style.js';
import { ifc } from './store.js';

window.onload = function () {
  var body = document.getElementsByTagName('body')[0];
  var head = document.getElementsByTagName('head')[0];

  mbr.stylesheet(style, head);

  Modal(body);

  mbr.dom('div', { className: 'mainblock' }, function (mainblock) {
    mainblock.appendTo(body);

    mainblock.append(
      Toolbar(),
      mbr.dom('div', { className: 'left-panel' }, function (leftPanel) {
        leftPanel.append(
          VersionList(),
          DiffList()
        )
      }),
      mbr.dom('div', { className: 'right-panel' }, function (rightPanel) {
        ifc.rightPanel = function (content) {
          rightPanel.clear();
          rightPanel.append(content);
        }
      })
    );
  });
};
