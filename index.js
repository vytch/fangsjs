require("babel-register");

const ElFactory = require('./providers/helpers/voiceOver');
const cheerio = require('cheerio');
const juice = require('juice');
const VoiceOverProvider = require('./providers/voiceOver.js');
const arLiterals = require('./utils/arLiterals.js');
const arIsNotCrawlable = require('./utils/arIsNotCrawlable.js');
const trim = require('./utils/trim.js');



// const content = require('./testContent/mix.js');HTMLContent

class HTMLContent {
  constructor(content, css) {

    // If the css is passed, then we need to take it into account and render the HTML with CSS applied.
    this.content = (typeof css === 'string')? juice.inlineContent(content, css) : content;
    this.translated = '';
    this.wrapperId = "fangs-output";
    this.$ = cheerio.load(`<div id="${this.wrapperId}">${content}</div>` );
    this.$container = this.$(`#${this.wrapperId}`);
    // this.provider = new VoiceOverProvider(this.$);
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
        this.write(ElFactory.El('button').output(e)); break
      case 'link':
        this.write(ElFactory.El('link').output(e)); break
      case 'menuitem':
      case 'menuitemcheckbox':
      case 'menuitemradio':
        this.write(ElFactory.El('menuItem').output(e)); break
      case 'option':
      case 'progressbar':
        this.write(ElFactory.El('progressbar').output(e)); break
      case 'radio':
      case 'scrollbar':
      case 'slider':
      case 'tab':
      case 'tabpanel':
      case 'textbox':
      case 'tooltip':
        this.write(ElFactory.El('tooltip').output(e)); break
      case 'treeitem':
        break;
    }
  }

  startNative(e) {
    switch(e.name.toLowerCase())
    {
      case 'blockquote':  this.write(ElFactory.El('blockquote').output(e)); break
      case 'a':  this.write(ElFactory.El('link').output(e)); break
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'h7':  this.write(ElFactory.El('heading').output(e.name.toLowerCase())); break
      case 'p':  this.write(ElFactory.El('paragraph').output()); break
      case 'img': this.write(ElFactory.El('image').output(e)); break
      case 'ul':  this.write(ElFactory.El('list').output(e)); break
      case 'ol':  this.write(ElFactory.El('list').output(e)); break
      case 'li':  this.write(ElFactory.El('listItem').output(this.$(e), e)); break
      case 'table':this.write(ElFactory.El('table').output(e)); break
      case 'tr': this.write(ElFactory.El('row').output(this.$(e), e)); break
      case 'td':
      case 'th': this.write(ElFactory.El('col').output(this.$(e), e)); break
      case 'input': this.write(this.outputFormInput(e)); break
      case 'textarea': this.write(ElFactory.El('textArea').output(e)); break
      case 'select': this.write(ElFactory.El('select').output(this.$(e))); break
      case 'dd': this.write(ElFactory.El('descriptionDesc').output(e)); break
      case 'dl': this.write(ElFactory.El('descriptionlist').output(e)); break
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
        this.write(ElFactory.El('menuItem').close(e)); break
      case 'progressbar':
        this.write(ElFactory.El('progressBar').close(e)); break
      case 'tooltip':
        this.write(ElFactory.El('tooltip').close(e)); break
    }
  }

  endNative(e) {
    if(typeof e.name === 'undefined'){
      return '';
    }
    switch(e.name.toLowerCase())
    {
      case 'blockquote':  this.write(ElFactory.El('blockquote').close(e)); break
      case 'table': this.write(ElFactory.El('table').close()); break
      case 'ul': this.write(ElFactory.El('list').close(e)); break
      case 'ol': this.write(ElFactory.El('list').close(e)); break
      case 'dl': this.write(ElFactory.El('list').close(e)); break
      case 'input': this.write(this.closeFormInput(e)); break
      case 'a':  this.write(ElFactory.El('link').close(e)); break
      case 'option': this.write(ElFactory.El('option').close(e)); break
      case 'button': this.write(ElFactory.El('button').close(e)); break
    }
  }

  endOutput(e) {
    if(e.attribs && e.attribs.role) {
      this.endRole(e);
    } else {
      this.endNative(e);
    }
  }

  //render form input element
  outputFormInput(e) {
    const $input = this.$(e);
    //Check for type attrib
    const aType = $input.attr('type');
    // console.log('atype', this.provider.outputCheckbox(e));

    if(aType!=null)
    {
      switch(aType.toLowerCase())
      {
        case 'text': this.write(ElFactory.El('inputText').output($input)); break;
        case 'submit': this.write(ElFactory.El('button').output(e)); break
        case 'button': this.write(ElFactory.El('button').output(e)); break
        case 'checkbox': this.write(ElFactory.El('checkbox').output(e)); break
        case 'radio': this.write(ElFactory.El('radio').output(e)); break
      }
    } else {
      //Old html for field. Ouput as plain text field.
      this.write(ElFactory.El('inputText').output(e));
    }
  }

  closeFormInput(e) {
    const $input = this.$(e);
    const aType = $input.attr('type');
    if(aType!=null)
    {
      switch(aType.toLowerCase())
      {
        case 'checkbox': this.write(ElFactory.El('checkbox').close($input)); break
        case 'radio': this.write(ElFactory.El('radio').close($input, this.$(`[name="${$input.attr('name')}"]`), e)); break
      }
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

  render() {
    return this.$container.html();
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

  getTranslated() {
    return this.translated;
  }
}

module.exports = HTMLContent;
