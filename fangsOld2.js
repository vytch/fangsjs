
// Create a trim function for strings
String.prototype.trim = function() 
{
  var s=this;
  s=s.replace(/^\s*(.*)/, '$1');
  s=s.replace(/(.*?)\s*$/, '$1');
  return s;
}
var wTarget;
//Character literal values
var arLiterals = new Array();
arLiterals[0] = new Array(/-/g, "dash");
arLiterals[1] = new Array(/>/g, "greater");
arLiterals[2] = new Array(/</g, "less");
arLiterals[3] = new Array(/§/g, "section");
arLiterals[4] = new Array(/:/g, "colon");
arLiterals[5] = new Array(/%/g, "percent");
arLiterals[6] = new Array(/\|/g, "vertical bar");
arLiterals[7] = new Array(/»/g, "right double angle bracket");
arLiterals[8] = new Array(/~/g, "tilde");
var arIsNotCrawlable = new Array('script', 'style', 'meta', 'head', 'caption');




function tojaws() 
{
  //open result window
  wTarget = window.open('','jaws','status=yes,scrollbars=yes,resizable=yes,width=600,height=600');
  
  //handle output
  Write("Jaws output:",true);
  StartDocument();
    
  crawl(document.getElementsByTagName('html')[0], 0);
  
  wTarget.document.close();
}





function StartDocument()
{
  //get headcount
  h1 = document.getElementsByTagName('h1');
  h2 = document.getElementsByTagName('h2');
  h3 = document.getElementsByTagName('h3');
  h4 = document.getElementsByTagName('h4');
  h5 = document.getElementsByTagName('h5');
  h6 = document.getElementsByTagName('h6');
  
  iHeaderCount = h1.length + h2.length + h3.length + h4.length + h5.length + h6.length;
  
  //Get link count
  alinks = document.getElementsByTagName('a');
  iLinkCount = alinks.length;
  
  if(iHeaderCount > 0 && iLinkCount > 0)
  {
    Write(Announce('Page has ' + iHeaderCount + ' heading' + ((iHeaderCount > 1) ? 's':'') + ' and ' + iLinkCount + ' link' + ((iLinkCount > 1) ? 's':'')) + ' ', true);  
  }
  
  if(iHeaderCount == 0 && iLinkCount > 0)
  {
    Write(Announce('Page has ' + iLinkCount + ' link' + ((iLinkCount > 1) ? 's':'')) + ' ', true);
  }
  
  //Get page title
  if(document.title!=null)
  {
    Write(Translate(document.title), true); 
  }

}




function crawl(e, r)
{
  if(!(e.nodeType==1 || e.nodeType==3))
    return;
  
  //write element info
  if(e.nodeType==3)
  {
    if(e.textContent.trim().length > 0)
    {
      Write(' ' + Translate(e.textContent));      
    }
  } else {
    JawsOutputStart(e);   
  }
  
  //Do not dive into the follwoing elements
  if(IsCrawlable(e))
  { 
    var ch = e.firstChild;  
    
    while (ch!=null)
    {
      crawl(ch, r+1);
      ch= ch.nextSibling;
    } 
  }
  
  //Close element
  JawsOutputEnd(e);
}




function IsCrawlable(e)
{
  if(IsHidden(e))
  {
    return false;
  }

  for (i = 0; i < arIsNotCrawlable.length; i++)
  {
    if(e.nodeName.toLowerCase()==arIsNotCrawlable[i])
    {
      return false;
    } 
  }
  return true;
}




//Ouput 
// Done
function JawsOutputStart(e)
{
  switch(e.nodeName.toLowerCase())
  {
    case 'blockquote':  Write(Announce('Block quote start')); break
    case 'a':  Write(Announce('link')); break 
    case 'h1':  Write(Announce('Heading level one')); break
    case 'h2':  Write(Announce('Heading level two')); break
    case 'h3':  Write(Announce('Heading level three')); break
    case 'img': OutputImage(e); break   
    case 'ul':  OutputList(e); break    
    case 'ol':  OutputList(e); break
    case 'li':  OutputListItem(e); break        
    case 'table': OutputTable(e); break
    default: ;         
  }
} 




function JawsOutputEnd(e)
{
  switch(e.nodeName.toLowerCase())
  {
    case 'blockquote':  Write(Announce('Block quote end')); break
    case 'table': Write(Announce('Table end')); break
    case 'ul': Write(Announce('List end')); break
    case 'ol': Write(Announce('List end')); break   
  }
} 




// Done
function Announce(sText)
{
  if(sText.length > 0)
  {
    return "<span class='announce'>" + sText + "</span> ";
  } else
  {
    return "";
  }
}


//write img
function OutputImage(e)
{
  //Check if image has alt text
  if(e.nodeName.toLowerCase()=='img')
  {
    //Check for alt attribute
    if(e.alt.trim().length > 0)
    {
      Write(Announce('Graphic ') + e.alt.trim());   
    } 
  }
}


//write list
function OutputList(e)
{
  //count list items
  iItemCount = ChildElementCount(e);

  //Check list type
  Write(Announce('List of ' + iItemCount + ' items'));
}

function OutputListItem(e)
{
  //Check list type
  if(e.parentNode.nodeName.toLowerCase()=='ul')
  {
    Write(Announce('bullet'));
  }
  
  if(e.parentNode.nodeName.toLowerCase()=='ol')
  {
    Write(Announce(GetSiblingOrder(e) + ''));
  } 
}

//Get the sibling position of the element
function GetSiblingOrder(e)
{
  iOrderNo = 1;

  psib = e.previousSibling;
  
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


//Check if an element is hidden by a css rule
function IsHidden(e)
{
  //const domUtils = Components.classes["@mozilla.org/inspector/dom-utils;1"].getService(Components.interfaces.inIDOMUtils);
  //const ruleList = domUtils.getCSSStyleRules(e);
  
  alert('c: ' + ruleList.Count());
  
  if(e.nodeType==1 && e.style.length > 0)
  { 
    if(e.style.display.toLowerCase()=='none')
    {
      return true;
    }
  }
  
  return false;
}


//output table
function OutputTable(e)
{
  //Check for caption
  eCaption = e.getElementsByTagName('caption');
  if(eCaption[0]!=null)
  {
    Write(Announce('Table caption: ') + Translate(eCaption[0].textContent));  
  }
  
  //Check for summary attrib
  aSummary = e.getAttribute('summary');
  if(aSummary!=null)
  {
    Write(Announce('Summary: ') + Translate(e.getAttribute('summary')) + ' ', false)
  }
  
  //Table size
  eRows = e.getElementsByTagName('tr');
  intColSize = ChildElementCount(eRows[0]);
  intRowSize = eRows.length;
  Write(Announce('Table with ' +  + intColSize + ' columns and ' +  intRowSize + ' rows'), false);
}


function ChildElementCount(e)
{
  iCount = 0;
  //Count non-text child nodes
  if(e!=null)
  {
    for(i=0; i < e.childNodes.length; i++)
    {
      if(e.childNodes[i].nodeType==1)
      {
        iCount++;
      }
    }
  }
  
  return iCount;

}


//Translate text to jaws ouput
function Translate(sText)
{
  if(sText!=null)
  {
    //Loop literals and replace text
    for(i=0; i < arLiterals.length;i++)
    {
      sText = sText.replace(arLiterals[i][0], ' ' + arLiterals[i][1] + ' ');
    }
    
    return sText;
  } else { return "";}
}

// Done
function Write(sText, blnNewLine)
{
  wTarget.document.write(sText);
  if(blnNewLine)
  {
    wTarget.document.write('<br/>');
  }
}


function WriteInfo(oNode)
{
  if(oNode.nodeType == 1 && oNode.nodeName!='#text')
  {
    wTarget.document.write(oNode.nodeName.toLowerCase() + ' NC: ' + oNode.childNodes.length + ' T: ' + oNode.nodeType + '<br/>');
    
    //write childnodes
  
    if(oNode.childNodes.length > 1)
    {
      for(intCounter = 0; intCounter < oNode.childNodes.length; intCounter++)
      {
        WriteInfo(oNode.childNodes[intCounter]);
      }
    }
  }
}
