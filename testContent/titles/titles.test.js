const expect = require('expect.js');
const content = require('./titles.js');
const Fangs = require('../../index.js');
const trim = require('../../utils/trim.js');

const output = (txt) => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

describe('Fangs', () => {
  it('should translate titles', () => {
    const fangContent = new Fangs(content);
    expect(output(fangContent.getTranslated())).to.equal(output(`
      <span class="announce">Heading level one</span>   
    H1 Title
   <span class="announce">Heading level two</span>   
    H2 Title
   <span class="announce">Heading level three</span>   
    H3 Title
   <span class="announce">Heading level four</span>   
    H4 Title
   <span class="announce">Heading level five</span>   
    H5 Title
   <span class="announce">Heading level six</span>   
    H6 Title`));
  });
});