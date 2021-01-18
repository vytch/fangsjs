export default (str:string|undefined):string => {
  if(typeof str === 'undefined'){
    return '';
  }
  str=str.replace(/^\s*(.*)/, '$1');
  str=str.replace(/(.*?)\s*$/, '$1');
  return str;
}
