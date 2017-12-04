module.exports = str => {
  if(typeof str === 'undefined'){
    return '';
  }
  str=str.replace(/^\s*(.*)/, '$1');
  str=str.replace(/(.*?)\s*$/, '$1');
  return str;
}