export default function (customElementName) {
  return fetch(`./control/custom-elements/${customElementName}.html`)
  .then(r => r.text())
  .then(templateCcontent => {
    const template = document.createElement('template');
    template.innerHTML = templateCcontent;

    return template.content;
  });
}
