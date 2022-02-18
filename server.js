const http = require('http')

const PORT = 9210;

function process (request, response) {
  
}

http.createServer(process).listen(PORT, '0.0.0.0', function () {
  console.log('Server is running on port ' + PORT);
})
