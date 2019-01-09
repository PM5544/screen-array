import readFile from './utils/readFile.mjs';
import writeFile from './utils/writeFile.mjs';

export async function retrieve({ path }) {
  let [fileName, ...nested] = path.split('.');

  let data;
  try {
    data = await readFile('.', 'server', 'storage', `${fileName}.json`);
    while (nested.length) {
      const propertyName = nested.shift();
      if (propertyName in data) {
        data = data[propertyName];
        continue;
      }
      throw new Error(`${propertyName}_not_found`);
    }
  } catch (e) {
    data = {};
  }

  return data;
}

export async function persist({ path, data }) {
  let [fileName, ...nested] = path.split('.');

  let oldData;
  let propertyName;
  let originalData = {};

  try {
    oldData = await readFile('.', 'server', 'storage', `${fileName}.json`);
    originalData = oldData;
    console.log(originalData);

    if (nested.length) {
      while (nested.length) {
        propertyName = nested.shift();
        if (!(propertyName in oldData)) {
          oldData[propertyName] = {};
        }
        oldData = oldData[propertyName];
      }

      oldData[propertyName] = { ...oldData[propertyName], ...data };
    } else {
      originalData = { ...originalData, ...data };
    }

    writeFile(originalData, '.', 'server', 'storage', `${fileName}.json`).catch(
      err => console.log(err)
    );

  } catch (e) {
    const storeThis = { ...originalData, ...data };
    writeFile(storeThis, '.', 'server', 'storage', `${fileName}.json`).catch(err =>
      console.log(err)
    );
  }

  return originalData;
}
