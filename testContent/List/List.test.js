const expect = require('expect.js');
const content = require('./List.js');
const contentNumbered = require('./NumberedList.js');
const Fangs = require('../../index.js');
const trim = require('../../utils/trim.js');

const output = (txt) => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

describe('Fangs', () => {
  it('should translate list', () => {
    const fangContent = new Fangs(content);
    expect(output(fangContent.getTranslated())).to.equal(output(`
      <span class="announce">List of 2 items</span> 
      <span class="announce">bullet</span> Item 1 
      <span class="announce">bullet</span> Item 2 
      <span class="announce">List end</span>
    `));
  });
  it('should translate numbered list', () => {
    const fangContent = new Fangs(contentNumbered);
    expect(output(fangContent.getTranslated())).to.equal(output(`
      <span class="announce">List of 2 items</span> 
      <span class="announce">1</span> Item 1 
      <span class="announce">2</span> Item 2 
      <span class="announce">List end</span>
    `));
  });
});