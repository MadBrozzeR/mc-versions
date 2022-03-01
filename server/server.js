const http = require('http');
const { Request } = require('mbr-serv');
const PATH = require('../path.js');
const actions = require('./actions.js');

const PORT = 9210;

function componentsRouter (components) {
  const result = {};

  for (let index = 0 ; index < components.length ; ++index) {
    result['/components/' + components[index]] = PATH.COMPONENTS + components[index];
  }

  return result;
}

const router = {
  '/': PATH.HTML + 'index.html',
  '/src/mbr-dom': PATH.NODE_MODULES + 'mbr-dom/dom.js',
  '/src/mbr-style': PATH.NODE_MODULES + 'mbr-style/index.js',
  '/favicon.ico': PATH.HTML + 'mbr-mc.ico',
  '/styles/index.js': PATH.HTML + 'styles/index.js',
  '/styles/animation.js': PATH.HTML + 'styles/animation.js',
  '/main.js': PATH.HTML + 'main.js',
  '/fetchers.js': PATH.HTML + 'fetchers.js',
  '/store.js': PATH.HTML + 'store.js',
  '/utils.js': PATH.HTML + 'utils.js',

  ...componentsRouter([
    'diff.js',
    'toolbar.js',
    'version-list.js',
    'waiter.js',
    'modal.js',
    'diff-list.js',
    'diff-pane.js',
  ]),

  '/act/versions': { GET: actions.versions },
  '/act/diff': { GET: actions.diff },
  '/act/download': { GET: actions.download },
};

function process (req, res) {
  const request = new Request(req, res);

  request.route(router);
}

http.createServer(process).listen(PORT, '0.0.0.0', function () {
  console.log('Server is running on port ' + PORT);
})
