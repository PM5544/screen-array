import fs from 'fs';
import util from 'util';
import { resolve, extname } from 'path';

const readDir = util.promisify(fs.readdir);

export default () =>
  readDir(resolve('static', 'animations')).then(paths =>
    paths.filter(path => extname(path) === '.mjs').map(fileName => `/animations/${fileName}`)
  );
