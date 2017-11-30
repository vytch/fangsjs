module.exports = str => {
  str=str.replace(/^\s*(.*)/, '$1');
  str=str.replace(/(.*?)\s*$/, '$1');
  return str;
}