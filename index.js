const fs = require('fs');
const MCRes = require('../resources/index.js');
const { MBRZip } = require('mbr-zip');
const { LoadQueue } = require('mbr-queue');
const { Git } = require('./git.js');

const versions = new MCRes.Versions();

const PATH = {};
PATH.ROOT = __dirname + '/data';
PATH.CLIENT = PATH.ROOT + '/client/';
PATH.SERVER = PATH.ROOT + '/server/';
PATH.ASSETS = PATH.ROOT + '/assets/';
PATH.JSON = PATH.ROOT + '/json/';
PATH.VERSION = PATH.JSON + '/version.json';
PATH.ASSET_INDEX = PATH.JSON + '/assets.json';

const git = new Git({ repo: PATH.ROOT });
function noop() {return};

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

function clear() {
  return clearDir(PATH.CLIENT, { verbose: true })
    .catch(noop).then(() => clearDir(PATH.ASSETS, { verbose: true }))
    .catch(noop).then(() => clearDir(PATH.SERVER, { verbose: true }))
    .catch(noop).then(() => clearDir(PATH.JSON, { verbose: true }))
    .catch(noop).then(noop);
}

function writeFile(name, data) {
  const lastSlash = name.lastIndexOf('/');
  const directory = lastSlash > -1 ? name.substring(0, lastSlash) : '';

  if (directory) {
    fs.mkdirSync(directory, { recursive: true });
  }

  fs.writeFileSync(name, data);
}

function UnZIP(buffer, dir = '') {
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
            if (!error) {
              writeFile(name, data);
            }
            queue.done();
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

function downloadAssets(version, options = {}) {
  return new Promise(function (resolve) {
    version.getAssets().then(function (assets) {
      const queue = new LoadQueue(10, {
        init: function (name) {
          const queue = this;

          version.getAsset(name).then(function (asset) {
            if (options.verbose) {
              console.log('Downloading ' + name);
            }

            asset.get().then(function (data) {
              writeFile(PATH.ASSETS + name, data)
              queue.done();
            })
          })
        },
        end: function () {
          resolve();
        }
      })

      for (const name in assets.objects) {
        queue.push(name)
      }
    })
  });
}

async function unpackVersion (version) {
  const info = await version.get();
  await git.co('master');
  await git.newBranch(info.id);
  console.log('Branch ' + info.id + ' created');

  console.log('Saving ' + PATH.VERSION)
  writeFile(PATH.VERSION, toJSON(info));

  console.log('Saving ' + PATH.ASSET_INDEX)
  const assetIndex = await version.getAssets();
  writeFile(PATH.ASSET_INDEX, toJSON(assetIndex))

  console.log('Downoloading client')
  const client = await version.getClient();
  console.log('Unpacking client')
  client && await UnZIP(client, PATH.CLIENT);

  console.log('Downoloading server')
  const server = await version.getServer();
  console.log('Unpacking server')
  server && await UnZIP(server, PATH.SERVER);

  console.log('Downloading assets')
  await downloadAssets(version, { verbose: true });

  await git.add();
  await git.ci(info.id);
  console.log('Commit created');

  return info;
}

//clear().then(function () {

  versions.get('22w07a')
  // versions.getFromFile('experimental/1_19_deep_dark_experimental_snapshot-1.json')
    .then(unpackVersion)
    .catch(console.error)
// });

