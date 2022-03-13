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
      data: [],
      length: 0,
      error: ''
    };
    const process = spawn(bin, args);

    process.stdout.on('data', function (data) {
      result.data.push(data);
      result.length += data.length;
    });
    process.stderr.on('data', function (data) {
      result.error += data;
    });
    process.on('close', function (code) {
      if (code === 0) {
        resolve(Buffer.concat(result.data, result.length));
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

function toString(buffer) {
  return buffer.toString();
}

Git.prototype.co = function (name) {
  return this.raw('checkout', name).then(() => true)
}

Git.prototype.newBranch = function (name) {
  return this.raw('checkout', '-b', name).then(() => true)
}

Git.prototype.ci = function (message) {
  return this.raw('commit', '-a', '-m', message).then(toString);
}

Git.prototype.add = function (path = '.') {
  return this.raw('add', ...path).then(toString);
}

Git.prototype.branch = function () {
  return this.raw('branch').then(parseByMatch(
    /[* ] (.*)\n/g,
    (match) => ({ name: match[1] })
  ));
}

Git.prototype.diffName = function (params) {
  const attrs = ['--numstat', '-l0', '-z'];

  if (params.refs) {
    attrs.push(...params.refs);
  }

  if (params.path instanceof Array) {
    attrs.push('--', ...params.path);
  } else if (typeof params === 'string') {
    attrs.push('--', params.path);
  }

  return this.raw('diff', ...attrs).then(parseByMatch(
    /(\d+|-)\t(\d+|-)\t(?:\000(.+?)\000)?(.+?)\000/g,
    (match) => ({
      name: match[4],
      oldName: match[3],
      changed: match[1] === '-' ? [] : [parseInt(match[1], 10), parseInt(match[2], 10)]
    })
  ));
}

Git.prototype.diffRaw = function (params) {
  const attrs = ['--raw', '--abbrev=40', '-z'];

  if (params.refs) {
    attrs.push(...params.refs);
  }

  if (params.path instanceof Array) {
    attrs.push('--', ...params.path);
  } else if (typeof params.path === 'string') {
    attrs.push('--', params.path);
  }

  return this.raw('diff', ...attrs).then(parseByMatch(
    /:(\d+) (\d+) ([\da-f]+) ([\da-f]+) (\w\d*)\000(?:([^:]+?)\000)?([^:]+?)\000/g,
    (match) => ({
      left: { mode: match[1], blob: match[3], name: match[6] || match[7] },
      right: { mode: match[2], blob: match[4], name: match[7] },
      type: match[5]
    })
  ));
};

Git.prototype.diff = function (params) {
  const attrs = ['-U0'];

  if (params.refs) {
    attrs.push(...params.refs);
  }

  if (params.path instanceof Array) {
    attrs.push('--', ...params.path);
  } else if (typeof params.path === 'string') {
    attrs.push('--', params.path);
  }

  return this.raw('diff', ...attrs).then(toString);
}

Git.prototype.show = function (params) {
  const promise = this.raw('show', params.ref + ':' + params.file);

  return params.convertToString ? promise.then(toString) : promise;
}

module.exports = { Git };
