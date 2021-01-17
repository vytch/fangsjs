export const childElementCount = (e: any): number => {
  let iCount:number = 0;
  //Count non-text child nodes
  if(e!=null)
  {
    for(let i:number=0; i < e.childNodes.length; i++)
    {
      if(e.childNodes[i].nodeType==1)
      {
        iCount++;
      }
    }
  }

  return iCount;
}
