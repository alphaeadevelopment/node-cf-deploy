const defaultOptions = {
  convertNumbers: true,
}

export default (str, opts = {}) => {
  const options = Object.assign({}, defaultOptions, opts);
  const match = str.match(/^(.*?)=(.*)$$/);
  if (!match) {
    return {
      key: str,
    }
  }
  const key = match[1];
  let value = match[2];
  if (options.convertNumbers && !isNaN(parseFloat(value)) && isFinite(value) && '0' !== value[0]) {
    value = parseFloat(value);
  }
  return {
    key,
    value,
  }

}
