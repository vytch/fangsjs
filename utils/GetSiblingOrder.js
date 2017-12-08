module.exports = e => {
  let iOrderNo = 1;

  let psib = e.previousSibling;
  console.log(e);

  while (psib!=null)
  {
    if(psib.name.toLowerCase() == e.name.toLowerCase())
    {
      iOrderNo++;
    }
    
    psib = psib.previousSibling;
  }
  return iOrderNo;
}