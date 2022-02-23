window.onload = function () {
  function qs (path, params) {
    var query = '';

    for (var key in params) {
      query += (query ? '&' : '') + key + '=' + encodeURIComponent(params[key]);
    }

    return path + (query ? ('?' + query) : '');
  }

  var get = {
    versions: function () {
      return fetch('/act/versions');
    },
    diff: function (params) {
      if (params.first && params.second) {
        return fetch(qs('/act/diff', {f: params.first, s: params.second}));
      }

      else return Promise.reject(new Error('Both version should be selected'));
    }
  }

  var ifc = {};

  function fetcher (request, onSuccess) {
    return request
      .then(function (response) { return response.json() })
      .then(onSuccess);
  }

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

  var body = document.getElementsByTagName('body')[0];
  var head = document.getElementsByTagName('head')[0];

  mbr.stylesheet(style, head);

  mbr.dom('div', null, function (mainblock) {
    mainblock.appendTo(body);

    var selectedVersions = {
      first: cnSwitcher('first'),
      second: cnSwitcher('second')
    }

    mainblock.append(
      mbr.dom('div', null, function (content) {
        fetcher(
          get.versions(),
          function (response) {
            content.clear();

            response.forEach(function (version) {
              content.append(
                mbr.dom('div', {
                  className: 'version'
                }, function (versionBlock) {
                  var flagCN;

                  versionBlock.on({
                    click: function (event) {
                      selectedVersions.first(flagCN, version.name);
                    },
                    contextmenu: function (event) {
                      event.preventDefault();

                      selectedVersions.second(flagCN, version.name);
                    }
                  });

                  versionBlock.append(
                    mbr.dom('span', null, function (flagBlock) {
                      flagCN = flagBlock.cn('version-flag');
                    }),
                    mbr.dom('span', { innerText: version.name })
                  )
                })
              );
            });
          }
        );
      }),
      mbr.dom('div', null, function (buttons) {
        buttons.append(
          mbr.dom('button', {innerText: 'Diff'}, function (diffButton) {
            diffButton.on({
              click: function () {
                fetcher(
                  get.diff({
                    first: selectedVersions.first.get(),
                    second: selectedVersions.second.get()
                  }),
                  (response) => ifc.difflist(response)
                )
              }
            })
          })
        )
      }),
      mbr.dom('div', null, function (difflist) {
        const groupCheck = {
          set: {
            Class: /^.+\.class$/
          },
          check: function (file) {
            for (var key in this.set) {
              if (this.set[key].test(file)) {
                return key;
              }
            }

            return '';
          }
        };

        ifc.difflist = function (files) {
          difflist.clear();

          var groups = {
            Class: [],
            Other: []
          };

          files.forEach(function (file) {
            const group = groupCheck.check(file);
            groups[group || 'Other'].push(file);
          });

          console.log(groups);
        }
      })
    );
  });
}
