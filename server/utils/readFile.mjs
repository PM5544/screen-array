import { promisify } from 'util';
import { join } from 'path';
import fs from 'fs';

const readFile = promisify(fs.readFile);

export default function(...path) {
  return readFile(join.apply(null, path), 'utf8')
    .then(JSON.parse)
    .catch(() => undefined);
}
