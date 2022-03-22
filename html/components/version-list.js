import { get, fetcher } from '../fetchers.js';
import { setup } from '../messenger.js';
import { Log } from './log.js';
import { VersionInfo } from './version-info.js';
import { Link } from './link.js';
import { ifc, selectedVersions } from '../store.js';
import { injectStyle } from '../styles/index.js';

injectStyle({
  '.version': {
    margin: '4px 0',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    width: '100%',

    '-list': {
      height: '100%',
      overflowY: 'auto',
      width: '100%'
    },

    '-download': {
      opacity: .4,
      display: 'inline-block',
      marginRight: '8px',
      cursor: 'default',

      '.active': {
        opacity: 1,
        cursor: 'pointer'
      }
    },

    '-flag': {
      cursor: 'pointer',
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: '1px solid #ddd',
      borderRadius: '3px',
      marginRight: '8px',
      verticalAlign: 'middle',

      '.first': {
        backgroundColor: '#0e0'
      },
      '.second': {
        backgroundColor: '#00e'
      }
    }
  }
});

function setupDownload (version, fromFile, onFinish) {
  let log;

  ifc.modalShow({ title: 'Downloading: ' + version }, log = Log());

  setup({
    command: 'd',
    id: version,
    message: version + (fromFile ? ('\t' + 'file') : ''),
    callback: function (command, message, updateId) {
      switch (command) {
        case 'log':
          log.ifc.push(message);
          break;
        case 'error':
          log.ifc.push(message, 'ERROR');
          break;
        case 'finish':
          log.ifc.push('DONE');
          onFinish();
          break;
        case 'update':
          log.ifc.update(updateId, message);
          break;
      }
    }
  });
}

export function VersionList() {
  return mbr.dom('div', { className: 'version-list' }, function (content) {
    fetcher(
      get.versions(),
      function (response) {
        content.clear();

        var versions = response.experimental.concat(
          response.versions.versions
        );
        var downloaded = response.downloaded;

        versions.forEach(function (version) {
          content.append(
            mbr.dom('div', { className: 'version' }, function (versionBlock) {
              versionBlock.append(
                mbr.dom('span', null, function (getButton) {
                  var isDownloadable = !downloaded.some(function (downloaded) {
                    return downloaded.name === version.id;
                  });
                  var buttonCN = getButton.cn('version-download');

                  function setView() {
                    if (isDownloadable) {
                      buttonCN.add('active');
                    } else {
                      buttonCN.del('active');
                    }
                  }

                  getButton.dom.innerText = '[get]';

                  setView();

                  getButton.on({
                    click: function () {
                      if (isDownloadable) {
                        setupDownload(
                          version.id,
                          version.fromFile,
                          () => { isDownloadable = false; setView() }
                        )
                      }
                    }
                  })
                }),
                mbr.dom('span', null, function (flagBlock) {
                  var flagCN = flagBlock.cn('version-flag');

                  flagBlock.on({
                    click: function () {
                      selectedVersions.first(flagCN, version.id);
                    },
                    contextmenu: function (event) {
                      event.preventDefault();

                      selectedVersions.second(flagCN, version.id);
                    }
                  });
                }),
                Link({ text: version.id, onClick: function () {
                  ifc.rightPanel(VersionInfo(version));
                } })
              )
            })
          );
        });
      }
    );
  });
}
