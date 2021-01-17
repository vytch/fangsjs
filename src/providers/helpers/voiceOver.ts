import {childElementCount} from '../../utils/childElementCount';
import arLiterals from '../../utils/arLiterals';
import trim from '../../utils/trim';
import {getSiblingOrder} from '../../utils/getSiblingOrder';
import cheerio from 'cheerio';

abstract class CoreElement {
    announce (sText:string):string {
      if(sText.length > 0) {
        return `<span class="announce">${sText}</span>`;
      } else {
        return "";
      };
    }
    translate (sText:string):string {
      if (sText!=null && typeof sText !== 'undefined') {
        //Loop literals and replace text
        for (let i=0; i < arLiterals.length; i++) {
          sText = sText.replace(arLiterals[i][0], ' ' + arLiterals[i][1] + ' ');
        }
        return sText;
      }
      return "";
    }
    abstract output(e: cheerio.TagElement, $?:cheerio.Cheerio, $siblings?:cheerio.Cheerio ):string;
    abstract close(e: cheerio.TagElement, $?:cheerio.Cheerio, $siblings?:cheerio.Cheerio):string;
}

class Option extends CoreElement {
  output():string {
    return '';
  }
  close():string {
    return this.announce(`menu item`);
  }
}

class Image extends CoreElement {
  output(e: cheerio.TagElement):string {
    if (e.name.toLowerCase()=='img') {
      //Check for alt attribute
      if (e.attribs.alt && trim(e.attribs.alt).length > 0) {
        return trim(e.attribs.alt) + this.announce(' Image');
      } else {
        return this.announce(' Image');
      }
    }
    return '';
  }
  close(e:cheerio.TagElement):string {
    if(typeof e.attribs.title != 'undefined'){
     return e.attribs.title;
    } else {
      return '';
    }
  }
}

class Heading extends CoreElement {
  private labels:{
    [id: string] : string;
  } = {
    h1: 'Heading level one',
    h2: 'Heading level two',
    h3: 'Heading level three',
    h4: 'Heading level four',
    h5: 'Heading level five',
    h6: 'Heading level six',
    h7: 'Heading level seven'
  }
  output(e:cheerio.TagElement){
    console.log(e);
    return this.announce(this.labels[e.name.toLowerCase()]);
  }
  close() {
    return '';
  }
}

class DescriptionList extends CoreElement {
  output(e:cheerio.TagElement){
    const $el = cheerio.load(e);
    return this.announce(`Description list ${$el.root().find('dt').length} items`);
  }
  close() {
    return '';
  }
}

class Paragraph extends CoreElement {
  output(e:cheerio.TagElement){
    return this.announce('*pause*');
  }
  close() {
    return '';
  }
};

class Tooltip extends CoreElement {
  output(e:cheerio.TagElement){
    return '';
  }
  close() {
    return this.announce(`Tooltip`);
  }
};

class Blockquote extends CoreElement {
  output(e:cheerio.TagElement){
    return '';
  }
  close() {
    return '';
  }
};

class Button extends CoreElement {
  output() {
    return 'Button';
  }
  close() {
    return this.announce('Button');
  }
};

class Checkbox extends CoreElement {
  output() {
    return '';
  }
  close(e:cheerio.TagElement, $input:cheerio.Cheerio) {
    return this.announce(` ${$input.prop('checked') ? 'checked' : 'unchecked'},  tickbox`);
  }
};

class Radio extends CoreElement {
  output() {
    return '';
  }
  close(e: cheerio.TagElement, $input:cheerio.Cheerio, $siblings:cheerio.Cheerio ) {
    const index = $siblings.index($input) + 1;
    return this.announce(`Radio buttons, ${$input.prop('checked') ? 'selected, ' : ''} ${index} of ${$siblings.length}`);
  }
};

class InputText extends CoreElement {
  output(e:cheerio.TagElement, $text:cheerio.Cheerio) {

    let value = trim($text.val());

    if (value === '') {
      value = 'blank';
    }
    return this.announce(`Input text ${value}`);
  }
  close() {
    return '';
  }
};

class Link  extends CoreElement {
  output() {
    return this.announce('Link');
  }
  close(e:cheerio.TagElement) {
    if(typeof e.attribs.title != 'undefined'){
     return e.attribs.title;
    } else {
      return '';
    }

  }
};

class List extends CoreElement {
  output(e:cheerio.TagElement) {
    //count list items
    const iItemCount = childElementCount(e);
    if(iItemCount > 1){
     return this.announce('List of ' + iItemCount + ' items');
    } else {
      return this.announce('List of 1 item');
    }
  }
  close() {
    return this.announce('List end');
  }
};

class ListItem extends CoreElement {
  output(e:cheerio.TagElement, $el: cheerio.Cheerio) {

    //Check list type

    const $parent:any = $el.parent();
    if($parent[0].name==='ul')
    {
      return this.announce('bullet');
    }
    //
    if($parent[0].name==='ol')
    {
      const index = $parent.children('li').index(e) + 1;
      return this.announce(index + '');
    }
    return '';
  }
  close() {
    return '';
  }
}

class Select extends CoreElement {
  output(e: cheerio.TagElement, $select:cheerio.Cheerio) {
   const $firstItem = $select.find('option').eq(0);
   return this.announce(`${$firstItem.text()} collapsed option button`);
  }
  close () {
    return '';
  }
};

class Table  extends CoreElement {
  output(e: cheerio.TagElement, $table: cheerio.Cheerio) {
    const output = [];
    let $caption:cheerio.Cheerio;
    let $summary:cheerio.Cheerio;

    $caption = $table.find('caption');
    if($caption.length > 0)
    {
      output.push(this.announce('Table caption: ') + this.translate($caption.text()));
    }
    //
    // //Check for summary attrib
    $summary = $table.find('summary');
    if($summary.length > 0)
    {
      output.push(this.announce('Summary: ') + this.translate($summary.text()) + ' ')
    }

    //Table size
    const $Rows = $table.find('tbody').length > 0 ? $table.find('tbody tr') : $table.find('tr');
    const intColSize = childElementCount($Rows[0]);
    const intRowSize = $Rows.length;
    output.push(this.announce('Table with ' +  + intColSize + ' columns and ' +  intRowSize + ' rows'));

    return output.join(' ');
  }
  close() {
    return this.announce('Table end');
  }
}

// TODO: tbody? thead
class Row extends CoreElement {
  output(e:cheerio.TagElement, $tr:cheerio.Cheerio ) {
    const $table = $tr.closest('table');
    const index = $table.find('tr').index($tr) + 1;

    return this.announce(`Row ${index} of ${$table.find('tr').length}`);
  }
  close() {
    return '';
  }
};

class Col extends CoreElement {
  output(e:cheerio.TagElement, $cell:cheerio.Cheerio) {
    const $tr = $cell.closest('tr');
    const index = $tr.find('td,th').index($cell) + 1;

    return this.announce(`Col ${index} of ${$tr.find('td,th').length}`);
  }
  close() {return ''}
}

/*
const descriptionDesc = {
  output: function() {
    return ''
  },
  close: function() {}
};

const textArea = {
  output: function($textarea) {

    let value = trim($textarea.val());

    if (value === '') {
      value = 'blank';
    }

    return this.announce(`Edit text ${value}`);
  },
  close: function() {}
};



const submit = {
  output: function() {
    return '';
  },
  close: function() {
    return this.announce(`Submit`);
  }
};

const progressBar = {
  output: function(e) {
    const $el = cheerio.load(e);
    if($el.attr('aria-valuetext')) {
      return this.announce($el.attr('aria-valuetext'));
    } else {
      return '';
    }
  },
  close: function(e) {
    const $el = cheerio.load(e);
    let progress = "";
    if($el.attr('aria-valuenow')) {
      progress = $el.attr('aria-valuenow');
    }
    return this.announce(`${progress} Progress indicator`);
  }
};

const menuItem = {
  output: function() {
    return this.announce(`menu item`);
  },
  close: function() {
    return this.announce(`menu item`);
  }
};

*/

export class ElFactory {
  static El(type:string):CoreElement {

    switch (type) {
      case 'heading':
        return new Heading();
        case 'button':
          return new Button();
      case 'paragraph':
        return new Paragraph();
      case 'image':
          return new Image();
      case 'checkbox':
          return new Checkbox();
      case 'radio':
          return new Radio();
      case 'inputText':
          return new InputText();
      case 'tooltip':
          return new Tooltip();
      case 'link':
          return new Link();
      case 'list':
          return new List();
      case 'table':
          return new Table();
          case 'row':
              return new Row();
              case 'col':
                  return new Col();
      case 'listItem':
          return new ListItem();
      case 'select':
        return new Select();
      case 'option':
        return new Option();
      case 'blockquote':
          return new Blockquote();
      default:
        throw new Error(`${type} not supported.`)
        break;
    }
  }
}
