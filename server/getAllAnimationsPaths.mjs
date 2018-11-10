import { readdir } from 'fs';
import { promisify } from 'util';
import { extname, join, sep } from 'path';

const readDir = promisify(readdir);
const animationsDirectory = 'animations';

export default async () => {
  const directoryContent = await readDir(join('static', animationsDirectory));

  return directoryContent
    .filter(p => extname(p) === '.mjs')
    .map(fileName => `${sep}${join(animationsDirectory, fileName)}`);
};
