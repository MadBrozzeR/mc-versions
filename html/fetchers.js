import { ifc } from './store.js';

function qs (path, params) {
  var query = '';

  for (var key in params) if (params[key]) {
    query += (query ? '&' : '') + key + '=' + encodeURIComponent(params[key]);
  }

  return path + (query ? ('?' + query) : '');
}

export var get = {
  versions: function () {
    return fetch('/act/versions');
  },
  diff: function (params) {
    if (params.first && params.second) {
      return fetch(qs('/act/diff', {f: params.first, s: params.second, n: params.file}));
    }

    return Promise.reject(new Error('Both version should be selected'));
  },
  download: function (version, fromFile) {
    if (version) {
      return fetch(qs('/act/download', {v: version, f: fromFile}));
    }

    return Promise.reject(new Error('Version should be provided'));
  }
};

export function fetcher (request, onSuccess) {
  ifc.waiterShow();

  return request
    .then(function (response) {
      ifc.waiterHide();

      return response.json();
    })
    .then(onSuccess);
}
