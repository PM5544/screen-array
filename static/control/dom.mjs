export const WIDTH = window.screen.width;
export const HEIGHT = window.screen.height;

export function empty(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
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

export const NodesProxy = createProxy('selector');
export const ActionsProxy = createProxy('action');

function createProxy(type) {
  return function(context) {
    return new Proxy(new Map(), {
      get(obj, property) {
        if (!obj.has(property)) {
          obj.set(property, context.querySelector(`[data-${type}=${property}]`));
        }
        return obj.get(property);
      },
      set(obj, property, value) {
        if (typeof value === 'string') {
          obj.set(property, context.querySelector(`[data-${type}=${property}]`));
        } else if (value.nodeType) {
          obj.set(property, value);
        }
      },
      deleteProperty(obj, property) {
        return obj.delete(property);
      }
    });
  };
}
