const { spawn } = require('child_process');

function Git (options = {}) {
  this.bin = options.binary || 'git';

  (options.repo) && (this.repo = options.repo);
}

Git.prototype.raw = function () {
  const {bin, repo} = this;
  const args = repo ? ['-C', repo, ...arguments] : [...arguments];

  return new Promise(function (resolve, reject) {
    const result = {
      data: '',
      error: ''
    };
    const process = spawn(bin, args);

    process.stdout.on('data', function (data) {
      result.data += data;
    });
    process.stderr.on('data', function (data) {
      result.error += data;
    });
    process.on('close', function (code) {
      if (code === 0) {
        resolve(result.data);
      } else {
        reject(result.error);
      }
    });
  });
};

function parseByMatch (re, prepare) {
  return function (response) {
    const result = [];
    let regMatch = null;
    response = response.toString();

    while (regMatch = re.exec(response)) {
      result.push(prepare(regMatch));
    }

    return result;
  }
}

Git.prototype.co = function (name) {
  return this.raw('checkout', name).then(() => true)
}

Git.prototype.newBranch = function (name) {
  return this.raw('checkout', '-b', name).then(() => true)
}

Git.prototype.ci = function (message) {
  return this.raw('commit', '-a', '-m', message);
}

Git.prototype.add = function (path = '.') {
  return this.raw('add', ...path);
}

Git.prototype.branch = function () {
  return this.raw('branch').then(parseByMatch(
    /[* ] (.*)\n/g,
    (match) => ({ name: match[1] })
  ));
}

Git.prototype.diff = function (params) {
  const attrs = [];

  if (params.nameOnly) {
    attrs.push('--name-only');
  }

  if (params.refs) {
    attrs.push(...params.refs);
  }

  if (params.path instanceof Array) {
    attrs.push('--', ...params.path);
  } else if (typeof params === 'string') {
    attrs.push('--', params.path);
  }

  return this.raw('diff', ...attrs);
}

module.exports = { Git };
