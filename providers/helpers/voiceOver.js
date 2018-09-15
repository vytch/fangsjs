const ChildElementCount = require('../../utils/ChildElementCount.js');
const arLiterals = require('../../utils/arLiterals.js');
const trim = require('../../utils/trim.js');

const GetSiblingOrder = require('../../utils/GetSiblingOrder.js');
const cheerio = require('cheerio');

const coreElement = {
    announce: {
      value: sText => {
        if(sText.length > 0) {
          return "<span class='announce'>" + sText + "</span> ";
        } else {
          return "";
        };
      }
    },
    translate: {
      value: sText => {
        if (sText!=null && typeof sText !== 'undefined') {
          //Loop literals and replace text
          for (let i=0; i < arLiterals.length; i++) {
            sText = sText.replace(arLiterals[i][0], ' ' + arLiterals[i][1] + ' ');
          }
          return sText;
        }
        return "";
      }
    }
};

const El = {
  output: function() {},
  close: function() {}
};

const option = {
  output: function() {
    return '';
  },
  close: function() {
    return this.announce(`menu item`);
  }
};


const image = {
  output: function(e) {
    if (e.name.toLowerCase()=='img') {
      //Check for alt attribute
      if (e.attribs.alt && trim(e.attribs.alt).length > 0) {
        return trim(e.attribs.alt) + this.announce(' Image');
      } else {
        return this.announce(' Image');
      }
    }
  },
  close: function(e) {
    if(typeof e.attribs.title != 'undefined'){
     return e.attribs.title;
    } else {
      return '';
    }
  }
}

const heading = {
  labels: {
    h1: 'Heading level one',
    h2: 'Heading level two',
    h3: 'Heading level three',
    h4: 'Heading level four',
    h5: 'Heading level five',
    h6: 'Heading level six',
    h7: 'Heading level seven'
  },
  output: function(heading) {
    return this.announce(this.labels[heading]);
  },
  close: function() {}
};

const descriptionList = {
  output: function (e) {
    const $el = cheerio.load(e);
    return this.announce(`Description list ${$el.find('dt').length} items`);
  },
  close: function() {}
};

const descriptionDesc = {
  output: function() {
    return ''
  },
  close: function() {}
};

const paragraph = {
  output: function() {
    return this.announce('*pause*');
  },
  close: function() {}
};

const link = {
  output: function() {
    return this.announce('Link');
  },
  close: function(e) {
    if(typeof e.attribs.title != 'undefined'){
     return e.attribs.title;
    } else {
      return '';
    }

  }
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

const inputText = {
  output: function($text) {

    let value = trim($text.val());

    if (value === '') {
      value = 'blank';
    }
    return this.announce(`Input text ${value}`);
  },
  close: function() {}
};

const blockquote = {
  output: function() {
    return '';
  },
  close: function() {
    return '';
  }
}

const button = {
  output: function() {
    return 'Button';
  },
  close: function() {
    return this.announce('Button');
  }
};

const submit = {
  output: function() {
    return '';
  },
  close: function() {
    return this.announce(`Submit`);
  }
};

const tooltip = {
  output: function() {
    return '';
  },
  close: function() {
    return this.announce(`Tooltip`);
  }
};

const checkbox = {
  output: function() {
    return '';
  },
  close: function($input) {
    return this.announce(` ${$input.prop('checked') ? 'checked' : 'unchecked'},  tickbox`);
  }
};

const radio = {
  output: function() {
    return '';
  },
  close: function($input, $siblings, e) {
    const index = $siblings.index(e) + 1;
    return this.announce(`Radio buttons, ${$input.prop('checked') ? 'selected, ' : ''} ${index} of ${$siblings.length}`);
  }
};

const list = {
  output: function(e) {
    //count list items
    const iItemCount = ChildElementCount(e);
    if(iItemCount > 1){
     return this.announce('List of ' + iItemCount + ' items');
    } else {
      return this.announce('List of 1 item');
    }
  },
  close: function() {
    return this.announce('List end');
  }
};

const listItem = {
  output: function($el, e) {
    //Check list type

    const $parent = $el.parent();
    if($parent[0].name==='ul')
    {
      return this.announce('bullet');
    }

    if($parent[0].name==='ol')
    {
      const index = $parent.children('li').index(e) + 1;
      return this.announce(index + '');
    }
  },
  close: function() {}
}

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

const table = {
  output: function(e) {
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
  },
  close: function() {
    return this.announce('Table end');
  }
}

const row = {
  output: function($tr, e) {
    const $table = $tr.closest('table');
    const index = $table.find('tr').index(e) + 1;

    return this.announce(`Row ${index} of ${$table.find('tr').length}`);
  },
  close: function() {}
};

const select = {
  output: function($select) {
   const $firstItem = $select.find('option').eq(0);
   return this.announce(`${$firstItem.text()} collapsed option button`);
  },
  close: function() {}
};

const menuItem = {
  output: function() {
    return this.announce(`menu item`);
  },
  close: function() {
    return this.announce(`menu item`);
  }
};

const col = {
  output: function($cell, e) {
    const $tr = $cell.closest('tr');
    const index = $tr.find('td,th').index(e) + 1;

    return this.announce(`Col ${index} of ${$tr.find('td,th').length}`);
  },
  close: function() {}
}

const ElFactory = {
    El(type) {
      if (typeof this.bundle[type] === 'undefined') {
        throw new Error(`${type} not supported.`)
      }
      return Object.create(this.bundle[type], coreElement);
    },
    bundle: {
      heading,
      image,
      descriptionList,
      descriptionDesc,
      paragraph,
      link,
      textArea,
      inputText,
      blockquote,
      button,
      submit,
      tooltip,
      checkbox,
      radio,
      list,
      listItem,
      option,
      progressBar,
      table,
      row,
      select,
      menuItem,
      col
    }
};

module.exports = ElFactory;