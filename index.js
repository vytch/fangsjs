require("babel-register");
const cheerio = require('cheerio');
const VoiceOverProvider = require('./providers/voiceOver.js');
const arLiterals = require('./utils/arLiterals.js');
const arIsNotCrawlable = require('./utils/arIsNotCrawlable.js');
const trim = require('./utils/trim.js');



// const content = require('./testContent/mix.js');HTMLContent

class HTMLContent {
  constructor(content) {
    this.content = content;
    this.translated = '';
    this.wrapperId = "fangs-output";
    this.$ = cheerio.load(`<div id="${this.wrapperId}">${content}</div>` );
    this.$container = this.$(`#${this.wrapperId}`);
    this.provider = new VoiceOverProvider(this.announce, this.translate, this.$);
    this.crawl(this.$container[0], 0);
  }

  crawl(e, r) {

    if(!(e.nodeType==1 || e.nodeType==3) || this.isHidden(e))
      return;

    //write element info
    if(e.nodeType==3)
    { 

      if(trim(e.data).length > 0)
      {
        this.write(' ' + this.translate(e.data));      
      }
    } else {
      this.startOutput(e);   
    }
    
    //Do not dive into the follwoing elements
    if(this.isCrawlable(e))
    { 
      var ch = e.firstChild;  
      
      while (ch!=null)
      {
        this.crawl(ch, r+1);
        ch= ch.nextSibling;
      } 
    }
    
    //Close element
    this.endOutput(e);
  }

  isCrawlable(e) {
    if(this.isHidden(e) || typeof e.name === 'undefined')
    {
      return false;
    }

    for (let i = 0; i < arIsNotCrawlable.length; i++)
    {
      if(e.name.toLowerCase()==arIsNotCrawlable[i])
      {
        return false;
      } 
    }
    return true;
  }

  //Check if an element is hidden by a css rule
  isHidden(e) {
    const $el = this.$(e);

    if(e.attribs && $el.css('display') === 'none')
    { 
      return true;
    }

    if($el.attr('aria-hidden') && $el.attr('aria-hidden').toLowerCase() === 'true'){
      return true;
    }
    return false;
  }

  startOutput(e) {
    if(e.attribs.role) {
      this.startRole(e);
    } else {
      this.startNative(e);
    }
  }

  startRole(e) {
    switch(e.attribs.role) {
      case 'button':
        this.write(this.provider.outputButton(e)); break
      case 'link':
        this.write(this.provider.outputLink(e)); break
      case 'menuitem':
      case 'menuitemcheckbox':
      case 'menuitemradio':
        this.write(this.provider.outputMenuItem(e)); break
      case 'option':
      case 'progressbar':
        this.write(this.provider.outputProgressBar(e)); break
      case 'radio':
      case 'scrollbar':
      case 'slider':
      case 'tab':
      case 'tabpanel':
      case 'textbox':
      case 'tooltip':
      case 'treeitem':
        break;
    }
  }

  startNative(e) {
    switch(e.name.toLowerCase())
    {
      case 'blockquote':  this.write(this.provider.outputBlockquote(e)); break
      case 'a':  this.write(this.provider.outputLink(e)); break 
      case 'h1':  
      case 'h2':  
      case 'h3':  
      case 'h4':  
      case 'h5':  
      case 'h6':  
      case 'h7':  this.write(this.provider.outputHeading(e.name.toLowerCase())); break
      case 'p':  this.write(this.provider.outputParagraph('*pause*')); break
      case 'img': this.write(this.provider.outputImage(e)); break   
      case 'ul':  this.write(this.provider.outputList(e)); break    
      case 'ol':  this.write(this.provider.outputList(e)); break  
      case 'li':  this.write(this.provider.outputListItem(e)); break        
      case 'table':this.write(this.provider.outputTable(e)); break
      case 'tr': this.write(this.provider.outputRow(e)); break
      case 'td':
      case 'th': this.write(this.provider.outputCol(e)); break
      case 'input': this.write(this.outputFormInput(e)); break
      case 'textarea': this.write(this.provider.outputTextArea(e)); break
      case 'select': this.write(this.provider.outputSelect(e)); break
      case 'dd': this.write(this.provider.outputDescriptionDesc(e)); break
      case 'dl': this.write(this.provider.outputDescriptionList(e)); break
      case 'frame': OutputFrame(e); break

      default: ;         
    }
  }

  endRole(e) {
    switch(e.attribs.role)
    {
      case 'menuitem':
      case 'menuitemcheckbox':
      case 'menuitemradio':
        this.write(this.provider.closeMenuItem(e)); break
      case 'progressbar':
        this.write(this.provider.closeProgressBar(e)); break
    }
  }

  endNative(e) {
    if(typeof e.name === 'undefined'){
      return '';
    }
    switch(e.name.toLowerCase())
    {
      case 'blockquote':  this.write(this.provider.closeBlockquote(e)); break
      case 'table': this.write(this.announce('Table end')); break
      case 'ul': this.write(this.provider.closeList(e)); break
      case 'ol': this.write(this.provider.closeList(e)); break   
      case 'dl': this.write(this.provider.closeList(e)); break
      // case 'input': CloseFormInput(e); break
      case 'a':  this.write(this.provider.closeLink(e)); break
      case 'frame':  CloseFrame(e); break
      case 'option': this.write(this.provider.closeOption(e)); break
    }
  }

  endOutput(e) {
    if(typeof e.name === 'undefined'){
      return '';
    }
    switch(e.name.toLowerCase())
    {
      case 'blockquote':  this.write(this.provider.closeBlockquote(e)); break
      case 'table': this.write(this.announce('Table end')); break
      case 'ul': this.write(this.provider.closeList(e)); break
      case 'ol': this.write(this.provider.closeList(e)); break   
      case 'dl': this.write(this.provider.closeList(e)); break
      case 'input': this.write(this.closeFormInput(e)); break
      case 'a':  this.write(this.provider.closeLink(e)); break
      case 'option': this.write(this.provider.closeOption(e)); break
      case 'button': this.write(this.provider.closeButton(e)); break
    }
  } 

  //render form input element
  outputFormInput(e) {
    const $input = this.$(e);
    //Check for type attrib
    const aType = $input.attr('type');
    console.log('atype', this.provider.outputCheckbox(e));

    if(aType!=null)
    {
      switch(aType.toLowerCase())
      {
        case 'text': this.write(this.provider.outputInputText(e)); break;
        case 'submit': this.write(this.provider.outputButton(e)); break
        case 'button': this.write(this.provider.outputButton(e)); break
        case 'checkbox': this.write(this.provider.outputCheckbox(e)); break
        case 'radio': this.write(this.provider.outputRadio(e)); break
      }
    } else {
      //Old html for field. Ouput as plain text field.
      this.write(this.provider.outputInputText(e));
    }
  }

  closeFormInput(e) {
    const $input = this.$(e);
    const aType = $input.attr('type');
    if(aType!=null)
    {
      switch(aType.toLowerCase())
      {
        case 'checkbox': this.write(this.provider.closeCheckbox(e)); break
        case 'radio': this.write(this.provider.closeRadio(e)); break
      }
    }
  }


  announce(sText) {
    if(sText.length > 0)
    {
      return "<span class='announce'>" + sText + "</span> ";
    } else
    {
      return "";
    }
  }

  write(sText, blnNewLine) {
    if(typeof sText === 'undefined'){
      return '';
    }
    this.translated += ' '+sText;
    if(blnNewLine)
    {
      this.translated += '<br/>';
    }
  }

  translate(sText) {
    if(sText!=null && typeof sText !== 'undefined')
    {
      //Loop literals and replace text
      for(let i=0; i < arLiterals.length; i++)
      {
        sText = sText.replace(arLiterals[i][0], ' ' + arLiterals[i][1] + ' ');
      }
      
      return sText;
    } else { return "";}
  }

  render() {
    return this.$container.html();
  }

  getTranslated() {
    return this.translated;
  }
}

module.exports = HTMLContent;