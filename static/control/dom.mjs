const doc = document;
const body = doc.body;

export function qSelect(selector, node = doc) {
  return node.querySelector(selector);
}

export function qSelectAll(selector, node = doc) {
  return Array.from(node.querySelectorAll(selector));
}

export const WIDTH = window.screen.width;
export const HEIGHT = window.screen.height;

export function create(nodeName) {
  return doc.createElement(nodeName);
}

export function getFormValues(target) {
  return Array.from(target).reduce((prev, cur) => {
    const { name, value } = cur;
    if (name && value) {
      return Object.assign(prev, {
        [name]: value
      });
    } else {
      return prev;
    }
  }, {});
}
