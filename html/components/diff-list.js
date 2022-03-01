import { cnSwitcher } from "../utils.js";

export const style = {
  '.diff-list': {
    height: '100%',
    width: '100%',
    overflowY: 'auto'
  },
  '.diff-group': {
    '__head': {
      padding: '4px',
      fontSize: '24px',
      cursor: 'pointer',

      ':hover': {
        color: '#bbf'
      }
    },
    '__title': {
      display: 'inline-block',
      marginLeft: '8px',
    },
    '__counter': {
      ':before': {
        display: 'inline',
        content: '" ("'
      },
      ':after': {
        display: 'inline',
        content: '")"'
      }
    },
    '__arrow': {
      display: 'inline-block',
      transition: '.2s transform ease-in-out'
    },
    '__list': {
      display: 'none',
      paddingLeft: '24px'
    },
    '__file': {
      cursor: 'pointer',

      ':hover': {
        color: '#bbf'
      },

      '.active': {
        color: '#99d'
      }
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
    'Version Info': /^(?:client|server|json)\/(version|assets).json$/,
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
        var selectedFile = cnSwitcher('active');
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
                  mbr.dom('span', { className: 'diff-group__title', innerText: groupName }),
                  mbr.dom('span', { className: 'diff-group__counter', innerText: groups[groupName].length })
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
                    mbr.dom('div', {
                      innerText: file.name + (
                        file.changed.length
                          ? (' [' + file.changed.join('/') + ']')
                          : ''
                        ),
                    }, function (fileBlock) {
                      var fileCN = fileBlock.cn( 'diff-group__file');
                      fileBlock.dom.onclick = function () {
                        selectedFile(fileCN);
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
