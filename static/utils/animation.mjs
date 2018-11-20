export function extend (args) {
  args.forEach(arg => {
    Object.entries(arg).forEach(([key, value]) => {
      this[key] = value;
    });
  });
}

export function getReleventPartOfSpectrum (spectrum = []) {
  const size = Math.floor(spectrum.length / this.clientCountOnSide);
  if (Number.isFinite(size)) {
    return spectrum.slice(this.clientIndexOnSide * size, (this.clientIndexOnSide + 1) * size );
  }
  return [];
}
