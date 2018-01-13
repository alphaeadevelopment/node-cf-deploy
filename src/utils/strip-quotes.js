const stripQuotes = (str) => {
  const match = str.match(/^"?(.*?)"$/);
  return match ? match[1] : str;

}
export default stripQuotes;
