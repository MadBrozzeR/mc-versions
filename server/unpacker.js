const MCRes = require('mc-resource')
const { LoadQueue } = require('mbr-queue');
const nbt = require('nbt-reader');
const PATH = require('../path.js')
const { Git } = require('../git.js');
const { UnZIP, writeFile, toJSON, clearDir } = require('../utils.js');

const git = new Git({ repo: PATH.ROOT });

function noop () {}

function clear(logger) {
  return clearDir(PATH.CLIENT, { logger })
    .catch(noop).then(() => clearDir(PATH.ASSETS, { logger }))
    .catch(noop).then(() => clearDir(PATH.SERVER, { logger }))
    .catch(noop).then(() => clearDir(PATH.JSON, { logger }))
    .catch(noop).then(noop);
}

function prepareUnzipData(name, data) {
  if (name.substring(name.length - 4) === '.nbt') {
    return new Promise(function (resolve) {
      nbt.read(data, function (error, newData) {
        if (error) {
          console.error(error);
          resolve(data);
        } else {
          resolve(JSON.stringify(newData, null, 2));
        }
      });
    });
  }

  return Promise.resolve(data);
}

function downloadAssets(version, options = {}) {
  return new Promise(function (resolve) {
    version.getAssets().then(function (assets) {
      const queue = new LoadQueue(5, {
        init: function (name) {
          const queue = this;

          version.getAsset(name).then(function (asset) {
            if (options.logger) {
              options.logger('Downloading ' + name);
            }

            return asset.get({
              onProgress: function (current, total) {
                options.onProgress && options.onProgress('Downloading ' + name, sizeToPercents(current, total))
              }
            }).then(function (data) {
              return writeFile(PATH.ASSETS + name, data).then(queue.done.bind(queue));
            })
          }).catch(function (error) {
            options.logger('Failed to download "' + name + '": ' + error.message, 'ERROR');
            queue.done();
          });
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

function sizeToPercents (current, total) {
  const value = Math.floor(current / total * 100) + '%';

  if (value.length === 2) {
    return '  ' + value;
  } else if (value.length === 3) {
    return ' ' + value;
  }

  return value;
}

async function unpackVersion (version, { logger, onProgress } = { logger: console.log }) {
  const info = await version.get();
  await git.co('master');
  await clear(logger);

  logger('Saving ' + PATH.VERSION)
  await writeFile(PATH.VERSION, toJSON(info));

  logger('Saving ' + PATH.ASSET_INDEX)
  const assetIndex = await version.getAssets();
  await writeFile(PATH.ASSET_INDEX, toJSON(assetIndex))

  logger('Downloading client')
  const client = await version.getClient({ onProgress: function (current, total) {
    onProgress && onProgress('Downloading client', sizeToPercents(current, total));
  } });
  logger('Unpacking client')
  client && await UnZIP(client, PATH.CLIENT, prepareUnzipData);

  logger('Downloading server')
  const server = await version.getServer({ onProgress: function (current, total) {
    onProgress && onProgress('Downloading server', sizeToPercents(current, total));
  } });
  logger('Unpacking server')
  server && await UnZIP(server, PATH.SERVER);

  logger('Downloading assets')
  await downloadAssets(version, { logger, onProgress });

  await git.newBranch(info.id);
  logger('Branch ' + info.id + ' created');
  await git.add();
  await git.ci(info.id);
  logger('Commit created');

  return info;
}

module.exports = { unpackVersion };

module.exports.versions = new MCRes.Versions();
