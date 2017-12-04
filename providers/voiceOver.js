const trim = require('../utils/trim.js');
const GetSiblingOrder = require('../utils/GetSiblingOrder.js');
const ChildElementCount = require('../utils/ChildElementCount.js');
const cheerio = require('cheerio');

class VoiceOverProvider {
  constructor(announce, translate, $){
    this.announce = announce;
    this.translate = translate;
    this.$ = $;
    console.log('VoiceOverProvider');
  }
  outputHeading(heading) {
    switch(heading) {
      case 'h1':
        return this.announce('Heading level one');
        break;
      case 'h2':
        return this.announce('Heading level two');
        break;
      case 'h3':
        return this.announce('Heading level three');
        break;
      case 'h4':
        return this.announce('Heading level four');
        break;
      case 'h5':
        return this.announce('Heading level five');
        break;
      case 'h6':
        return this.announce('Heading level six');
        break;
      case 'h7':
        return this.announce('Heading level seven');
        break;
    }
  }

  outputImage(e) {
    //Check if image has alt text

    if(e.name.toLowerCase()=='img')
    {
      //Check for alt attribute
      if(e.attribs.alt && trim(e.attribs.alt).length > 0)
      {
        return trim(e.attribs.alt) + this.announce(' Image');   
      } else {
        return this.announce(' Image');
      }
    }
  }

  outputDescriptionDesc(e) {
    return '';
  }


  outputDescriptionList(e) {
    const $el = this.$(e);
    return this.announce(`Description list ${$el.find('dt').length} items`);
  }

  outputParagraph(e) {
    return this.announce('*pause*');
  }

  outputLink(e) {
    return this.announce('Link');
  }

  outputTextArea(e){
    const $textarea = this.$(e);
    let value = trim($textarea.val());

    if (value === '') {
      value = 'blank';
    }

    return this.announce(`Edit text ${value}`);
  }

  outputInputText(e) {
    const $text = this.$(e);
    let value = trim($text.val());

    if (value === '') {
      value = 'blank';
    }
    return this.announce(`Input text ${value}`);
  }

  outputBlockquote(e) {
    return '';
  }

  closeBlockquote(e) {
    return '';
  }

  outputButton(e) {
    return this.announce(`Button`);
  }

  closeButton(e) {
    return this.announce(`Button`);
  }

  outputSubmit(e) {
    return this.announce(``);
  }
  closeSubmit(e) {
    return this.announce(`Submit`);
  }

  outputCheckbox(e) {
    return '';
  }
  closeCheckbox(e) {
    const $input = this.$(e);
    // [TODO]: Checked/ Unchecked
    return this.announce(` ${$input.prop('checked') ? 'checked' : 'unchecked'},  tickbox`);
  }

  outputRadio(e) {
    // [TODO]: Checked/ Unchecked
    return '';
  }
  closeRadio(e) {
    const $input = this.$(e);
    const name = $input.attr('name');
    const $siblings = this.$(`[name="${name}"]`);
    const index = $siblings.index(e) + 1;
    // [TODO]: Checked/ Unchecked
    return this.announce(`Radio buttons, ${$input.prop('checked') ? 'selected, ' : ''} ${index} of ${$siblings.length}`);
  }

  closeLink(e) {
    if(typeof e.attribs.title != 'undefined'){
     return e.attribs.title;
    } else {
      return '';
    }
  }

  //write list
  outputList(e) {
    //count list items
    const iItemCount = ChildElementCount(e);
    if(iItemCount > 1){
     return this.announce('List of ' + iItemCount + ' items');
    } else {
      return this.announce('List of 1 item');
    }
  }

  outputListItem(e) {
    //Check list type
    if(e.parentNode.name.toLowerCase()=='ul')
    {
      return this.announce('bullet');
    }
    
    if(e.parentNode.name.toLowerCase()=='ol')
    {
      return this.announce(GetSiblingOrder(e) + '');
    } 
  }

  closeList(e) {
    return this.announce('List end');
  }

  //output table
  outputTable(e) {
    const $table = cheerio.load(e);
    const output = [];

    const eCaption = $table('caption');
    if(eCaption[0]!=null)
    {
      output.push(this.announce('Table caption: ') + this.translate(eCaption[0].textContent));  
    }
    
    //Check for summary attrib
    const aSummary = $table('summary');
    if(aSummary.length > 0)
    {
      output.push(this.announce('Summary: ') + this.translate(aSummary.text()) + ' ')
    }
    
    //Table size
    const eRows = $table('tbody').length > 0 ? $table('tbody tr') : $table('tr');
    const intColSize = ChildElementCount(eRows[0]);
    const intRowSize = eRows.length;
    output.push(this.announce('Table with ' +  + intColSize + ' columns and ' +  intRowSize + ' rows'));

    return output.join(' ');
  }

  outputProgressBar(e) {
    const $el = $(e);
    if($el.attr('aria-valuetext')) {
      return this.announce($el.attr('aria-valuetext'));
    } else {
      return '';
    }
    
  }

  closeProgressBar(e) {
    const $el = $(e);
    let progress = "";
    if($el.attr('aria-valuenow')) {
      progress = $el.attr('aria-valuenow');
    }
    return this.announce(`${progress} Progress indicator`);
  }

  outputRow(e){
    const $tr = this.$(e);
    const $table = $tr.closest('table');
    const index = $table.find('tr').index(e) + 1;

    return this.announce(`Row ${index} of ${$table.find('tr').length}`);
  }

  outputSelect(e){
    const $select = this.$(e);
    const $firstItem = $select.find('option').eq(0);
    return this.announce(`${$firstItem.text()} collapsed option button`);
  }

  outputMenuItem(e) {
    return '';
  }

  closeMenuItem(e) {
    return this.announce(`menu item`);
  }

  closeOption(e){
    return this.announce(`menu item`);
  }

  outputCol(e){
    const $cell = this.$(e);
    const $tr = $cell.closest('tr');
    const index = $tr.find('td,th').index(e) + 1;

    return this.announce(`Col ${index} of ${$tr.find('td,th').length}`);
  }
}

module.exports = VoiceOverProvider;