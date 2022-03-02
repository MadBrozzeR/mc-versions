import { cnSwitcher, cnToggle } from "../utils.js";

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
    '__changes-number': {
      color: '#999',
      marginLeft: '8px'
    },
    '__file': {
      cursor: 'pointer',
      paddingLeft: '10px',
      color: '#eee',

      ':hover': {
        color: '#bbf'
      },

      '.active': {
        color: '#99d'
      }
    },
    '__directory': {
      paddingLeft: '10px',
      color: '#999'
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

function Directory (name, parent) {
  return mbr.dom('div', {
    innerText: name,
    className: 'diff-group__directory'
  }).appendTo(parent);
}

function File ({ name, file, parent, onClick }) {
  return mbr.dom('div', null, function (block) {
    parent && block.appendTo(parent);
    const fileCN = block.cn('diff-group__file');

    block.append(
      mbr.dom('span', { innerText: name })
    );
    if (file.changed.length) {
      block.append(
        mbr.dom('span', {
          className: 'diff-group__changes-number',
          innerText: '[' + file.changed.join('/') + ']'
        })
      )
    }
    block.dom.onclick = function () {
      onClick(file, fileCN);
    }
  });
}

function Group({ name, parent, onSelect }) {
  return mbr.dom('div', null, function (group) {
    var groupCN = group.cn('diff-group');
    var counter = {
      block: null,
      value: 0,
      add: function () {
        this.block.dom.innerText = ++this.value;
      }
    };

    group.append(
      mbr.dom('div', { className: 'diff-group__head' }, function (head) {
        head.append(
          mbr.dom('span', { className: 'diff-group__arrow', innerHTML: '&searr;' }),
          mbr.dom('span', { className: 'diff-group__title', innerText: name }),
          counter.block = mbr.dom('span', { className: 'diff-group__counter', innerText: counter.value })
        );

        head.dom.onclick = cnToggle('active', groupCN);
      }),
      mbr.dom('div', { className: 'diff-group__list' }, function (list) {
        const tree = {
          element: list,
          children: {}
        };

        group.ifc = {
          push: function (file) {
            if (!counter.value) {
              group.appendTo(parent);
            }

            counter.add();
            const path = file.name.split('/');
            const lastIndex = path.length - 1;
            let current = tree;

            for (let index = 0 ; index < path.length ; ++index) {
              if (index === lastIndex) {
                current.children[path[index]] = File({
                  name: path[index],
                  file: file,
                  parent: current.element,
                  onClick: onSelect
                });
              } else {
                if (!(path[index] in current.children)) {
                  current.children[path[index]] = {
                    element: Directory(path[index], current.element),
                    children: {}
                  };
                }
                current = current.children[path[index]];
              }
            }
          }
        }
      })
    );
  });
}

const groupCheck = {
  set: {
    Class: /^.+\.class$/,
    Meta: /^(?:client|server)\/META-INF\/.+$/,
    'Version Info': /^(?:client|server|json)\/(version|assets).json$/,
    Structures: /^client\/data\/minecraft\/structures\/.+\.nbt$/,
    Assets: /^assets\/.+$/,
    'Client Data': /^client\/.+$/,
    'Server Data': /^server\/.+$/,

    'Other': /^.+$/
  },
  check: function (file) {
    for (var key in this.set) {
      if (this.set[key].test(file.name)) {
        return key;
      }
    }
  },
  getGroups: function (parent, onSelect) {
    var result = {};

    for (var name in this.set) {
      result[name] = Group({ name, parent, onSelect });
    }

    return result;
  }
};

export function DiffList({ onSelect }) {
  return mbr.dom('div', { className: 'diff-list' }, function (difflist) {
    difflist.ifc = {
      set: function (files) {
        difflist.clear();
        var selectedFile = cnSwitcher('active');
        var groups = groupCheck.getGroups(difflist, function (file, fileCN) {
          selectedFile(fileCN);
          onSelect(file);
        });

        files.forEach(function (file) {
          const group = groupCheck.check(file);

          groups[group].ifc.push(file);
        });
      }
    }
  })
}
