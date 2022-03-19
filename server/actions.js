const MCRes = require('mc-resource')
const { Git } = require('../git.js');
const PATH = require('../path.js');
const { unpackVersion } = require('./unpacker.js');
const { getExperimental } = require('./fs.js');

const git = new Git({ repo: PATH.ROOT });
const versions = new MCRes.Versions();

function getImage ({name, mode}, ref) {
  return mode === '000000' ? null : '/res/image/'
    + name
    + '?r=' + encodeURIComponent(ref);
}

/*
function getSound ({name, mode}, ref) {
  return mode === '000000' ? null : '/res/sound/'
    + name
    + '?r=' + encodeURIComponent(ref);
}
*/

function getExtension (name) {
  const dotIndex = name.lastIndexOf('.');

  return dotIndex > -1
    ? name.substring(dotIndex + 1)
    : '';
}

const DIFF_VARIANTS = {
  IMAGE: function (params) {
    return git.diffRaw({
      refs: [params.s, params.f],
      path: params.n
    }).then((result) => ({
      type: 'picture',
      src: [
        getImage(result[0].left, params.s),
        getImage(result[0].right, params.f)
      ]
    }));
  },
  TEXT: function (params) {
    return Promise.all([
      git.diff({
        refs: [params.s, params.f],
        path: params.n
      }),
      git.show({
        ref: params.s,
        file: params.n
      }).catch(() => '')
    ]).then(([diff, content]) => ({
      type: 'text',
      content: content.toString(),
      diff
    }));
  },
  SOUND: function (params) {
    return git.diffRaw({
      refs: [params.s, params.f],
      path: ['*.ogg', '*.mus']
    }).then(function (changes) {
      return {
        type: 'sound',
        changes,
        refs: [params.s, params.f],
        current: params.n
      };
    });
  }
}

const extToType = {
  'png': DIFF_VARIANTS.IMAGE,
  'gif': DIFF_VARIANTS.IMAGE,
  'ogg': DIFF_VARIANTS.SOUND,
  'mus': DIFF_VARIANTS.SOUND,
  default: DIFF_VARIANTS.TEXT
}

module.exports.versions = function (request) {
  Promise.all([
    versions.getList(),
    git.branch().catch(() => []),
    getExperimental()
  ]).then(function ([versions, downloaded, experimental]) {
    request.send(JSON.stringify({
      versions,
      downloaded,
      experimental
    }));
  });
};

module.exports.diff = function (request) {
  const params = request.getParams();
  const {f: firstRev, s: secondRev, n: fileName} = params;

  if (fileName) {
    const ext = getExtension(fileName);

    (extToType[ext] || extToType.default)(params)
      .then(function (data) {request.send(JSON.stringify(data))});
  } else {
    git.diffName({
      refs: [secondRev, firstRev]
    }).then(function (diff) {
      request.send(JSON.stringify(diff));
    });
  }
}

module.exports.download = function (request) {
  const {v: version, f: file} = request.getParams();
  const promise = file
    ? versions.getFromFile(PATH.EXPERIMENTAL + version + '.json')
    : versions.get(version);

  promise
    .then(unpackVersion)
    .then(function () {
      request.send('null');
    })
    .catch(function (error) {
      console.error(error);
      request.status = 400;
      request.send();
    });
}

module.exports.getImage = function (regMatch) {
  const request = this;
  const fileName = regMatch[1];
  const { r: revision } = request.getParams();
  const ext = getExtension(fileName);

  git.show({ ref: revision, file: fileName }).then(function (data) {
    request.send(data, ext);
  }).catch(function (error) {console.error(error)});
}

module.exports.getSound = function (regMatch) {
  const request = this;
  const fileName = regMatch[1];
  const { r: revision } = request.getParams();
  const ext = getExtension(fileName);

  git.show({ ref: revision, file: fileName }).then(function (data) {
    request.send(data, ext);
  }).catch(function (error) {console.error(error)});
}
