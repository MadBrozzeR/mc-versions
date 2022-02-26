export var ifc = {};

function cnSwitcher (name, value) {
  var store = value;
  var lastCN = null;

  function switcher(cn, value) {
    if (lastCN) {
      lastCN.del(name);
    }

    lastCN = cn.add(name);

    store = value;
  }

  switcher.get = function () {
    return store;
  }

  return switcher;
}

export var selectedVersions = {
  first: cnSwitcher('first'),
  second: cnSwitcher('second')
}
