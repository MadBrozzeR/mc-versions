// import { get, fetcher } from '../fetchers.js';
// import { ifc, selectedVersions } from '../store.js';
// import { Diff } from './diff.js';

export const style = {
  '.diff-list': {
    height: '100%',
    width: '100%',
    overflowY: 'auto'
  },
  '.diff-group': {
    ' .diff-group__head': {
      padding: '4px',
      fontSize: '24px',
      cursor: 'pointer'
    },
    ' .diff-group__title': {
      display: 'inline-block',
      marginLeft: '8px'
    },
    ' .diff-group__arrow': {
      display: 'inline-block',
      transition: '.2s transform ease-in-out'
    },
    ' .diff-group__list': {
      display: 'none',
      paddingLeft: '24px'
    },

    '.active': {
      ' .diff-group__arrow': {
        transform: 'rotate3d(1, 0, 0, 180deg)'
      },
      ' .diff-group__list': {
        display: 'block'
      },
    }
  },
};

const groupCheck = {
  set: {
    Class: /^.+\.class$/,
    Meta: /^(?:client|server)\/META-INF\/.+$/,
    VersionInfo: /^(?:client|server|json)\/(version|assets).json$/,
    Structures: /^client\/data\/minecraft\/structures\/.+\.nbt$/,
    Assets: /^assets\/.+$/,
    'Client Data': /^client\/.+$/,
    'Server Data': /^server\/.+$/,
  },
  check: function (file) {
    for (var key in this.set) {
      if (this.set[key].test(file.name)) {
        return key;
      }
    }

    return 'Other';
  },
  getGroups: function () {
    var result = {};

    for (var name in this.set) {
      result[name] = [];
    }
    result.Other = [];

    return result;
  }
};

export function DiffList({ onSelect }) {
  return mbr.dom('div', { className: 'diff-list' }, function (difflist) {
    difflist.ifc = {
      set: function (files) {
        difflist.clear();
        var groups = groupCheck.getGroups();

        files.forEach(function (file) {
          const group = groupCheck.check(file);

          groups[group].push(file);
        });

        for (var groupName in groups) {
          if (groups[groupName].length === 0) {
            continue;
          }

          mbr.dom('div', null, function (diffGroup) {
            diffGroup.appendTo(difflist);
            var groupCN = diffGroup.cn('diff-group');
            var isOpen = false;

            diffGroup.append(
              mbr.dom('div', { className: 'diff-group__head' }, function (head) {
                head.append(
                  mbr.dom('span', { className: 'diff-group__arrow', innerHTML: '&searr;' }),
                  mbr.dom('span', { className: 'diff-group__title', innerText: groupName })
                );

                head.dom.onclick = function () {
                  if (isOpen) {
                    groupCN.del('active');
                  } else {
                    groupCN.add('active');
                  }

                  isOpen = !isOpen;
                }
              }),
              mbr.dom('div', { className: 'diff-group__list' }, function (list) {
                groups[groupName].forEach(function (file) {
                  list.append(
                    mbr.dom('div', { innerText: file.name }, function (fileBlock) {
                      fileBlock.dom.onclick = function () {
                        onSelect(file);
                      }
                    })
                  );
                });
              })
            );
          });
        }
      }
    }
  })
}
