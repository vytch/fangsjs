import cheerio from 'cheerio';
import juice from 'juice';
import { Element } from 'domhandler';
import arIsNotCrawlable from './utils/arIsNotCrawlable';
import arLiterals from './utils/arLiterals';
import trim from './utils/trim';
import {ElFactory} from './providers/helpers/voiceOver';

export class Fang {
  private content:string;
  private translated: string = '';
  private wrapperId:string = 'fangs-output';
  private $:cheerio.Root;
  private $container: any;

  constructor(content:string, css?:string) {
    this.content = (typeof css === 'string')? juice.inlineContent(content, css) : content;
    this.$ = cheerio.load(`<div id="${this.wrapperId}">${content}</div>` );
    this.$container = this.$(`#${this.wrapperId}`);
    if(this.$container.length > 0){
      // console.log(this.$container[0].nodeType);
      this.crawl(this.$container[0], 0);
    }

  }
  crawl(e:any, r:number) {

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

  startOutput(e:cheerio.TagElement) {
    if(e.attribs.role) {
      this.startRole(e);
    } else {
      this.startNative(e);
    }
  }

  startNative(e: cheerio.TagElement) {
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
      case 'h7':  this.write(
        ElFactory
          .El('heading')
          .output(e)
      );
        break
      case 'p':  this.write(ElFactory.El('paragraph').output(e)); break
      case 'img': this.write(ElFactory.El('image').output(e)); break
      case 'ul':  this.write(ElFactory.El('list').output(e)); break
      case 'ol':  this.write(ElFactory.El('list').output(e)); break
      case 'li':  this.write(ElFactory.El('listItem').output( e, this.$(e))); break
      case 'table':this.write(ElFactory.El('table').output(e, this.$(e))); break
      case 'tr': this.write(ElFactory.El('row').output( e, this.$(e))); break
      case 'td':
      case 'th': this.write(ElFactory.El('col').output( e, this.$(e))); break
      case 'input': this.outputFormInput(e); break
      case 'textarea': this.write(ElFactory.El('textArea').output(e)); break
      case 'select': this.write(ElFactory.El('select').output(e, this.$(e))); break
      case 'dd': this.write(ElFactory.El('descriptionDesc').output(e)); break
      case 'dl': this.write(ElFactory.El('descriptionlist').output(e)); break

      default: ;
    }
  }

  write(sText:string, blnNewLine:boolean = false) {
    if(typeof sText === 'undefined'){
      return '';
    }
    this.translated += ' '+sText;
    if(blnNewLine)
    {
      this.translated += '<br/>';
    }
  }

  endOutput(e:cheerio.TagElement) {
    if(e.attribs && e.attribs.role) {
      this.endRole(e);
    } else {
      this.endNative(e);
    }
  }

  endRole(e:cheerio.TagElement) {
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

  closeFormInput(e:cheerio.TagElement) {
    const $input = this.$(e);
    const aType = $input.attr('type');
    if(aType!=null)
    {
      switch(aType.toLowerCase())
      {
        case 'checkbox': this.write(ElFactory.El('checkbox').close(e, $input)); break
        case 'radio': this.write(ElFactory.El('radio').close(e, $input, this.$(`[name="${$input.attr('name')}"]`))); break
      }
    }
  }

  endNative(e:cheerio.TagElement) {
    if(typeof e.name === 'undefined'){
      return '';
    }
    switch(e.name.toLowerCase())
    {
      case 'blockquote':  this.write(ElFactory.El('blockquote').close(e)); break
      case 'table': this.write(ElFactory.El('table').close(e)); break
      case 'ul': this.write(ElFactory.El('list').close(e)); break
      case 'ol': this.write(ElFactory.El('list').close(e)); break
      case 'dl': this.write(ElFactory.El('list').close(e)); break
      case 'input': this.closeFormInput(e); break
      case 'a':  this.write(ElFactory.El('link').close(e)); break
      case 'option': this.write(ElFactory.El('option').close(e)); break
      case 'button': this.write(ElFactory.El('button').close(e)); break
    }
  }
  startRole(e:cheerio.TagElement) {
    switch(e.attribs.role) {
      case 'button':
        this.write(ElFactory.El('button').output(e)); break
      case 'link':
        this.write(ElFactory.El('link').output(e)); break
      case 'menuitem':
      case 'menuitemcheckbox':
      case 'menuitemNode':
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

  isCrawlable(e:cheerio.TagElement):boolean {
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

  isHidden(e:cheerio.TagElement):boolean {
    const $el:cheerio.Cheerio = this.$(e);

    if(e.attribs && $el.css('display') === 'none')
    {
      return true;
    }

    if(
      typeof $el.attr('aria-hidden') === 'string' &&
      $el.attr('aria-hidden')!.toLowerCase() === 'true'){
      return true;
    }
    return false;
  }

  //render form input element
  outputFormInput(e: cheerio.TagElement):void {
    const $input = this.$(e);
    //Check for type attrib
    const aType = $input.attr('type');
    // console.log('atype', this.provider.outputCheckbox(e));

    if(aType!=null)
    {
      switch(aType.toLowerCase())
      {
        case 'text': this.write(ElFactory.El('inputText').output(e, $input)); break;
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

  translate(sText:string):string {
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

  getTranslated():string {
    return this.translated;
  }
}
