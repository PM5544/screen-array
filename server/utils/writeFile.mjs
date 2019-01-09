import { promisify } from 'util';
import { join } from 'path';
import fs from 'fs';

const writeFile = promisify(fs.writeFile);

export default function(data, ...path) {
  console.log(join.apply(null, path));
  return writeFile(join.apply(null, path), JSON.stringify(data), 'utf8').catch(() => {
    return '';
  });
}
