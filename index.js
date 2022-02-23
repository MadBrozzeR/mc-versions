const fs = require('fs');
const MCRes = require('../resources/index.js');
const { LoadQueue } = require('mbr-queue');
const { Git } = require('./git.js');
const PATH = require('./path.js')
const { UnZIP, writeFile, toJSON, clearDir } = require('./utils.js');

const versions = new MCRes.Versions();

const git = new Git({ repo: PATH.ROOT });
function noop() {return};

function clear() {
  return clearDir(PATH.CLIENT, { verbose: true })
    .catch(noop).then(() => clearDir(PATH.ASSETS, { verbose: true }))
    .catch(noop).then(() => clearDir(PATH.SERVER, { verbose: true }))
    .catch(noop).then(() => clearDir(PATH.JSON, { verbose: true }))
    .catch(noop).then(noop);
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
              writeFile(PATH.ASSETS + name, data).then(queue.done.bind(queue));
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
  await writeFile(PATH.VERSION, toJSON(info));

  console.log('Saving ' + PATH.ASSET_INDEX)
  const assetIndex = await version.getAssets();
  await writeFile(PATH.ASSET_INDEX, toJSON(assetIndex))

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

  versions.get('1.18.1-rc1')
  // versions.getFromFile('experimental/1_19_deep_dark_experimental_snapshot-1.json')
    .then(unpackVersion)
    .catch(console.error)
// });

