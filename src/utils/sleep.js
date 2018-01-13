
export default (t) => {
  const ms = t + new Date().getTime();
  while (new Date() < ms) { }
}
