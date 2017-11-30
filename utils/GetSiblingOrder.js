module.exports = e => {
  let iOrderNo = 1;

  let psib = e.previousSibling;
  
  while (psib!=null)
  {
    if(psib.nodeName.toLowerCase()==e.nodeName.toLowerCase())
    {
      iOrderNo++;
    }
    
    psib = psib.previousSibling;
  }
  return iOrderNo;
}