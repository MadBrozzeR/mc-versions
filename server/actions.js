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

  git.diffName({
    refs: [params.f, params.s]
  }).then(function (diff) {
    request.send(JSON.stringify(diff));
  });
}
