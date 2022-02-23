const { Git } = require('../git.js');
const PATH = require('../path.js');
const git = new Git({ repo: PATH.ROOT });

module.exports.versions = function (request) {
  git.branch().then(function (branches) {
    request.send(JSON.stringify(branches));
  });
};

module.exports.diff = function (request) {
  const params = request.getParams();

  git.diff({
    refs: [params.f, params.s],
    nameOnly: true
  }).then(function (diff) {
    request.send(JSON.stringify(diff.toString().split('\n')));
  });
}
