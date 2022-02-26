const MCRes = require('mc-resource')
const { Git } = require('../git.js');
const PATH = require('../path.js');
const { unpackVersion } = require('./unpacker.js');
const { getExperimental } = require('./fs.js');

const git = new Git({ repo: PATH.ROOT });
const versions = new MCRes.Versions();

module.exports.versions = function (request) {
  Promise.all([
    versions.get(),
    git.branch().catch(() => []),
    getExperimental()
  ]).then(function ([versions, downloaded, experimental]) {
    request.send(JSON.stringify({
      versions,
      downloaded,
      experimental
    }));
  })

};

module.exports.diff = function (request) {
  const params = request.getParams();

  if (params.n) {
    Promise.all([
      git.diff({
        refs: [params.f, params.s],
        path: params.n
      }),
      git.show({
        ref: params.f,
        file: params.n
      })
    ]).then(function ([diff, content]) {
      request.send(JSON.stringify({
        type: 'text',
        content,
        diff
      }));
    });
  } else {
    git.diffName({
      refs: [params.f, params.s]
    }).then(function (diff) {
      request.send(JSON.stringify(diff));
    });
  }
}

module.exports.download = function (request) {
  const params = request.getParams();
  const version = params.v;
  const promise = params.f
    ? versions.getFromFile(PATH.EXPERIMENTAL + version + '.json')
    : versions.get(version);

  promise
    .then(unpackVersion)
    .then(function () {
      request.send();
    })
    .catch(function (error) {
      console.error(error);
      request.status = 400;
      request.send();
    });
}
