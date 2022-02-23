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
    ifc.waiterShow();

    return request
      .then(function (response) {
        ifc.waiterHide();

        return response.json();
      })
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

  mbr.dom('div', null, function (curtain) {
    curtain.appendTo(body);
    var curtainCN = curtain.cn('modal__curtain');
    var blocks = {
      title: null,
      content: null
    };
    var size = 'l';
    var state = '';
    curtainCN.add('size_' + size);

    ifc.modalHide = function (stateToHide) {
      if (!stateToHide || stateToHide === state) {
        curtainCN.del('active');
      }
    }

    ifc.modalShow = function (options, content) {
      options = options || {};
      var newSize = options.size || 'l';

      state = options.state || '';

      if (newSize !== size) {
        curtainCN.del('size_' + size);
        curtainCN.add('size_' + newSize);
        size = newSize;
      }

      blocks.title.dom.innerText = options.title || '';
      blocks.content.clear();
      blocks.content.append(content);
      curtainCN.add('active');
    }

    curtain.append(mbr.dom('div', { className: 'modal' }, function (modal) {
      modal.append(
        mbr.dom('div', { className: 'modal__head' }, function (title) {
          title.append(
            blocks.title = mbr.dom('span', { className: 'modal__title', innerText: 'asafsdf sdaf sadf' }),
            mbr.dom('span', {
              className: 'modal__close',
              innerHTML: '&#10060;',
              onclick: function () {ifc.modalHide()}
            })
          );
        }),
        blocks.content = mbr.dom('div', { className: 'modal__content' })
      );
    }));
  });

  var waiter = mbr.dom('div', { className: 'waiter__wrapper' }, function (wrapper) {
    wrapper.append(mbr.dom('div', { className: 'waiter' }));

    ifc.waiterShow = function () {
      ifc.modalShow({ title: 'Loading...', size: 's', state: 'waiter' }, waiter);
    }

    ifc.waiterHide = function () {
      ifc.modalHide('waiter');
    }
  });


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

        ifc.difflist = function (files) {
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

                  head.on({
                    click: function () {
                      if (isOpen) {
                        groupCN.del('active');
                      } else {
                        groupCN.add('active');
                      }

                      isOpen = !isOpen;
                    }
                  })
                }),
                mbr.dom('div', { className: 'diff-group__list' }, function (list) {
                  groups[groupName].forEach(function (file) {
                    list.append(
                      mbr.dom('div', { innerText: file.name }, function (fileBlock) {
                        fileBlock.on({
                          click: function () {
                            ifc.modalShow({ title: file.name }, mbr.dom('div'));
                          }
                        })
                      })
                    );
                  });
                })
              );
            });
          }
        }
      })
    );
  });
}
