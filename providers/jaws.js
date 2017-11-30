const trim = require('../utils/trim.js');

class JawsProvider {
  constructor(){
    this.announce = announce;
    console.log('JawsProvider');
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
        return this.announce('Graphic ') + trim(e.attribs.alt);   
      } else {
        return this.announce('Graphic ');
      }
    }
  }

  outputBlockquote(e) {
    return this.announce('Block quote start');
  }
  closeBlockquote(e) {
    return this.announce('Block quote end');
  }

}
module.exports = JawsProvider;
