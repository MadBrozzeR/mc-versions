import { cnSwitcher, cnToggle } from "../utils.js";
import { Tree } from "./tree.js";

export const style = {
  '.diff-list': {
    height: '100%',
    width: '100%',
    overflowY: 'auto'
  },
  '.diff-group': {
    '.hidden': {
      display: 'none'
    },

    '__head': {
      padding: '4px',
      fontSize: '24px',
      cursor: 'pointer',

      ':hover': {
        color: '#bbf'
      },
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

function Group({ name, parent, onSelect }) {
  return mbr.dom('div', null, function (group) {
    var groupCN = group.cn('diff-group').add('hidden');
    var counter = {
      block: null,
      value: 0,
      add: function () {
        this.block.dom.innerText = ++this.value;
      }
    };
    let tree;

    group.appendTo(parent).append(
      mbr.dom('div', { className: 'diff-group__head' }, function (head) {
        head.append(
          mbr.dom('span', { className: 'diff-group__arrow', innerHTML: '&searr;' }),
          mbr.dom('span', { className: 'diff-group__title', innerText: name }),
          counter.block = mbr.dom('span', { className: 'diff-group__counter', innerText: counter.value })
        );

        head.dom.onclick = cnToggle('active', groupCN);
      }),
      tree = Tree({
        className: 'diff-group__list',
        renderFile: function (name, _fullName, params) {
          counter.add();
          if (counter.value === 1) {
            groupCN.del('hidden');
          }

          return mbr.dom('div', null, function (block) {
            const fileCN = block.cn('diff-group__file');
            block.append(
              mbr.dom('span', { innerText: name })
            );
            if (params.changed.length) {
              block.append(
                mbr.dom('span', {
                  className: 'diff-group__changes-number',
                  innerText: '[' + params.changed.join('/') + ']'
                })
              )
            }
            block.dom.onclick = function () {
              onSelect(params, fileCN);
            }
          });
        }
      })
    );

    group.ifc = {
      push: function (file) {
        tree.ifc.push(file.name, file);
      }
    }
  });
}

const groupCheck = {
  set: {
    Class: /^.+\.class$/,
    Meta: /^(?:client|server)\/META-INF\/.+$/,
    'Version Info': /^(?:client|server|json)\/(version|assets).json$/,
    Structures: /^client\/data\/minecraft\/structures\/.+\.nbt$/,
    Localization: /^assets\/.+\/lang\/.+\.json$/,
    Sounds: /^assets\/.+\.(ogg|mus)$/,
    Assets: /^assets\/.+$/,
    'Block States': /^client\/assets\/minecraft\/blockstates\/\w+\.json$/,
    Models: /^client\/assets\/minecraft\/models\/.+\.json$/,
    Textures: /^client\/assets\/minecraft\/textures\//,
    Advancements: /^client\/data\/minecraft\/advancements\/.+\.json$/,
    'Loot Tables': /^client\/data\/minecraft\/loot_tables\/.+\.json$/,
    Recipes: /^client\/data\/minecraft\/recipes\/.+\.json$/,
    Tags: /^client\/data\/minecraft\/tags\/.+\.json$/,
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
