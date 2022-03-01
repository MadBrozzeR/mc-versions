const fs = require('fs');
const { MBRZip } = require('mbr-zip');
const { LoadQueue } = require('mbr-queue');

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

function writeFile(name, data) {
  return new Promise(function (resolve, reject) {
    function write() {
      fs.writeFile(name, data, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    }

    const lastSlash = name.lastIndexOf('/');
    const directory = lastSlash > -1 ? name.substring(0, lastSlash) : '';

    if (directory) {
      fs.mkdir(directory, { recursive: true }, function (error) {
        if (error) {
          reject(error)
        } else {
          write();
        }
      });
    } else {
      write();
    }
  });
}

function UnZIP(buffer, dir = '', prepare) {
  return new Promise(function (resolve) {
    const zip = new MBRZip(buffer);

    const queue = new LoadQueue(10, {
      init: function (record) {
        const queue = this;
        const name = (dir ? (dir+ '/') : '') + record.header.name;

        if (name[name.length - 1] === '/') {
          queue.done();
        } else {
          record.extract(function (error, data) {
            if (error) {
              queue.done();
            } else {
              if (prepare) {
                prepare(name, data).then(function (data) {
                  writeFile(name, data).then(function () {queue.done()});
                });
              } else {
                writeFile(name, data).then(function () {queue.done()});
              }
            }
          })
        }
      },
      end: function () {
        resolve()
      }
    })

    zip.iterate(function (name, record) {
      queue.push(record);
    })
  });
}

function toJSON(object) {
  return JSON.stringify(object, null, 2);
}

function clearDir (directory, options = {}) {
  return new Promise(function (resolve, reject) {
    let count = 0;

    function decreaseCounter() {
      if (!--count) {
        resolve();
      }
    }

    fs.readdir(directory, function (error, files) {
      if (error) {
        reject(error);
      } else {
        if (options.verbose) {
          console.log('Clearing ' + directory);
        }

        count = files.length;

        if (!count) {
          resolve();
        }

        for (let index = 0 ; index < files.length ; ++index) {
          const file = directory + '/' + files[index];

          fs.stat(file, function (error, stats) {
            if (error) {
              reject(error);
            } else {
              if (stats.isDirectory()) {
                clearDir(file).then(function () {
                  fs.rmdir(file, function (error) {
                    if (error) {
                      reject(error);
                    } else {
                      decreaseCounter();
                    }
                  });
                }).catch(reject);
              } else {
                fs.unlink(file, function (error) {
                  if (error) {
                    reject(error);
                  } else {
                    decreaseCounter();
                  }
                });
              }
            }
          });
        }
      }
    })
  });
}

module.exports = {
  JSONPrettify,
  JSONPrettifyFile,
  writeFile,
  UnZIP,
  toJSON,
  clearDir,
};
