module.exports = e => {
  let iCount = 0;
  //Count non-text child nodes
  if(e!=null)
  {
    for(let i=0; i < e.childNodes.length; i++)
    {
      if(e.childNodes[i].nodeType==1)
      {
        iCount++;
      }
    }
  }
  
  return iCount;
}