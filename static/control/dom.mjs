export const WIDTH = window.screen.width;
export const HEIGHT = window.screen.height;

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
