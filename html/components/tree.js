export const style = {
  '.fs-tree': {
    '__directory': {
      paddingLeft: '10px',
      color: '#999'
    },
    '__file': {
      paddingLeft: '10px',
      color: '#eee',
    }
  }
};

function Directory (name, parent) {
  return mbr.dom('div', {
    innerText: name,
    className: 'fs-tree__directory'
  }).appendTo(parent);
}

function File ({ name, file, parent, render, params }) {
  return mbr.dom('div', { className: 'fs-tree__file' }, function (block) {
    block.appendTo(parent).append(
      render(name, file, params)
    );
  });
}

export function Tree ({ files, renderFile, className } = {}) {
  return mbr.dom('div', null, function (root) {
    const rootCN = root.cn('fs-tree');
    const tree = {
      element: root,
      children: {}
    };

    className && rootCN.add(className);

    root.ifc = {
      push: function (fileName, params) {
        const path = fileName.split('/');
        const lastIndex = path.length - 1;
        let current = tree;

        for (let index = 0 ; index < path.length ; ++index) {
          if (index === lastIndex) {
            current.children[path[index]] = File({
              name: path[index],
              file: fileName,
              render: renderFile,
              params: params,
              parent: current.element
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
    };

    files && files.forEach(tree.ifc.push);
  });
}
