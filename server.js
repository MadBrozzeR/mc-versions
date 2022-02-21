const http = require('http');
const { Request } = require('mbr-serv');

const PORT = 9210;

const HTML_ROOT = __dirname + '/html/';

const router = {
  '/': HTML_ROOT + 'index.html',
  '/src/mbr-dom': __dirname + '/node_modules/mbr-dom/dom.js',
  '/src/mbr-style': __dirname + '/node_modules/mbr-style/index.js',
  '/src/main.js': HTML_ROOT + 'main.js',
  '/src/style.js': HTML_ROOT + 'style.js'
}

function process (req, res) {
  const request = new Request(req, res);

  request.route(router);
}

http.createServer(process).listen(PORT, '0.0.0.0', function () {
  console.log('Server is running on port ' + PORT);
})
