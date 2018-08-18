const fs = require('fs');
const util = require('util');
const { resolve, extname } = require('path');

const readDir = util.promisify(fs.readdir);

module.exports = function() {
  return readDir(resolve(__dirname, '..', 'static', 'animations')).then(paths =>
    paths.filter(path => extname(path) === '.mjs').map(fileName => `/animations/${fileName}`)
  );
};
