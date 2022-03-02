export function cnSwitcher (name, value) {
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

export function cnToggle(name, cn, value = false) {
  return function () {
    if (value) {
      cn.del(name);
      value = false;
    } else {
      cn.add(name);
      value = true;
    }
  }
}
