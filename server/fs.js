const fs = require('fs');
const PATH = require('../path.js');

module.exports.getExperimental = function () {
  return new Promise(function (resolve) {
    fs.readdir(PATH.EXPERIMENTAL, function (error, files) {
      if (error) {
        resolve([]);
      } else {
        const result = [];

        files.forEach(file => {
          if (file.substring(file.length - 5) === '.json') {
            result.push({ id: file.substring(0, file.length - 5), fromFile: true });
          }
        })

        resolve(result);
      }
    });
  });
}
