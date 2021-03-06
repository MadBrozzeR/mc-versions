const PATH = {};

PATH.ROOT = __dirname + '/data';
PATH.CLIENT = PATH.ROOT + '/client/';
PATH.SERVER = PATH.ROOT + '/server/';
PATH.ASSETS = PATH.ROOT + '/assets/';
PATH.JSON = PATH.ROOT + '/json/';
PATH.VERSION = PATH.JSON + 'version.json';
PATH.ASSET_INDEX = PATH.JSON + 'assets.json';
PATH.EXPERIMENTAL = __dirname + '/experimental/';

PATH.HTML = __dirname + '/html/';
PATH.NODE_MODULES = __dirname + '/node_modules/';
PATH.COMPONENTS = PATH.HTML + '/components/';

module.exports = PATH;
