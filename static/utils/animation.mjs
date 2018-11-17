export function extend (args) {
  args.forEach(arg => {
    Object.entries(arg).forEach(([key, value]) => {
      this[key] = value;
    });
  });
}
