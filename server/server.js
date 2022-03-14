const http = require('http');
const { Request } = require('mbr-serv');
const MadSocket = require('madsocket');
const PATH = require('../path.js');
const actions = require('./actions.js');
const {versions, unpackVersion} = require('./unpacker.js');

const PORT = 9210;

const WS_RE = {
  DOWNLOAD: /^d\[(.+?)\]:(.+?)(\tfile)?$/
}

const ws = new MadSocket({
  message: function (message) {
    const regMatch = WS_RE.DOWNLOAD.exec(message);
    const client = this;

    if (regMatch) {
      const [, id, version, fromFile] = regMatch;
      client.send('start[' + id + ']');
      const promise = fromFile
        ? versions.getFromFile(PATH.EXPERIMENTAL + version + '.json')
        : versions.get(version);

        promise.then(result => unpackVersion(result, function (log, level) {
          if (level === 'ERROR') {
            client.send('error[' + id + ']:' + log);
          } else {
            client.send('log[' + id + ']:' + log);
          }
        })).then(function () {
          client.send('finish[' + id + ']')
        }).catch(function (error) {
          console.log(error);
          client.send('error[' + id + ']:' + error.message);
          client.send('finish[' + id + ']');
        });
    }
  }
});

function componentsRouter (components) {
  const result = {};

  for (let index = 0 ; index < components.length ; ++index) {
    result['/components/' + components[index]] = PATH.COMPONENTS + components[index];
  }

  return result;
}

function leeching (request) {
  ws.leach(request.request, request.response);
}

const router = {
  '/': PATH.HTML + 'index.html',
  '/src/mbr-dom': PATH.NODE_MODULES + 'mbr-dom/dom.js',
  '/src/mbr-style': PATH.NODE_MODULES + 'mbr-style/index.js',
  '/favicon.ico': PATH.HTML + 'mbr-mc.ico',
  '/styles/index.js': PATH.HTML + 'styles/index.js',
  '/styles/animation.js': PATH.HTML + 'styles/animation.js',
  '/styles/scrollbars.js': PATH.HTML + 'styles/scrollbars.js',
  '/main.js': PATH.HTML + 'main.js',
  '/fetchers.js': PATH.HTML + 'fetchers.js',
  '/store.js': PATH.HTML + 'store.js',
  '/utils.js': PATH.HTML + 'utils.js',
  '/messenger.js': PATH.HTML + 'messenger.js',

  ...componentsRouter([
    'diff.js',
    'toolbar.js',
    'version-list.js',
    'waiter.js',
    'modal.js',
    'diff-list.js',
    'diff-pane.js',
    'log.js',
    'player.js',
    'diff/compare.js',
    'diff/text-diff.js',
    'diff/sound-diff.js',
    'diff/pic-diff.js',
    'diff/index.js',
  ]),

  '/ws': leeching,

  '/act/versions': { GET: actions.versions },
  '/act/diff': { GET: actions.diff },
  '/act/download': { GET: actions.download },
};

const ROUTE_MATCH = {
  IMAGE: [
    /^\/res\/image\/(.+)$/,
    actions.getImage
  ],
  SOUND: [
    /^\/res\/sound\/(.+)$/,
    actions.getSound
  ]
};

function process (req, res) {
  const request = new Request(req, res);

  request.match(...ROUTE_MATCH.IMAGE)
    || request.match(...ROUTE_MATCH.SOUND)
    || request.route(router);
}

http.createServer(process).listen(PORT, '0.0.0.0', function () {
  console.log('Server is running on port ' + PORT);
});
