let supportsDynamicImport = true;
try {
  import('').catch(e => {});
} catch(e){
  supportsDynamicImport = false;
}

console.log(supportsDynamicImport);

export default (specifier) => {
  if (supportsDynamicImport) {
    return import(specifier);
  }
  return fetch(specifier)
    .then(r => r.text())
    .then(moduleContent => {
      const m = new Function (`"use strict"
      ${moduleContent.replace('export default', 'return')}`);

      debugger;
      return m();
    })
  ;
}
