import { get, fetcher } from '../fetchers.js';
import { selectedVersions } from '../store.js';

export const style = {
  '.version': {
    margin: '4px 0',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    width: '100%',

    '-list': {
      height: '50%',
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
};

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
                        fetcher(
                          get.download(version.id, version.fromFile),
                          () => { isDownloadable = false; setView() }
                        );
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
                mbr.dom('span', { innerText: version.id })
              )
            })
          );
        });
      }
    );
  });
}