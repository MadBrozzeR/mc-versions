const http = require('http');
const { Request } = require('mbr-serv');
const PATH = require('../path.js');
const actions = require('./actions.js');

const PORT = 9210;

const router = {
  '/': PATH.HTML + 'index.html',
  '/src/mbr-dom': PATH.NODE_MODULES + 'mbr-dom/dom.js',
  '/src/mbr-style': PATH.NODE_MODULES + 'mbr-style/index.js',
  '/favicon.ico': PATH.HTML + 'mbr-mc.ico',
  '/src/style.js': PATH.HTML + 'style.js',
  '/main.js': PATH.HTML + 'main.js',

  '/components/diff.js': PATH.COMPONENTS + 'diff.js',

  '/act/versions': { GET: actions.versions },
  '/act/diff': { GET: actions.diff },
  '/act/download': { GET: actions.download },
}

function process (req, res) {
  const request = new Request(req, res);

  request.route(router);
}

http.createServer(process).listen(PORT, '0.0.0.0', function () {
  console.log('Server is running on port ' + PORT);
})
