const fs = require('fs');

function JSONPrettify(data) {
  return JSON.stringify(JSON.parse(data.toString()), null, 2);
}

function JSONPrettifyFile (file) {
  return new Promise(function (resolve, reject) {
    fs.readFile(file, function (error, data) {
      if (error) {
        reject(error)
      } else {
        try {
          const json = JSONPrettify(data);

          fs.writeFile(file, json, function (error) {
            if (error) {
              reject(error)
            } else {
              resolve();
            }
          });
        } catch (error) {
          reject(error);
        }
      }
    })
  });
}

module.exports = {
  JSONPrettify,
  JSONPrettifyFile
};
