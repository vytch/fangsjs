const expect = require('expect.js');
const content = require('./select.js');
const Fangs = require('../../index.js');
const trim = require('../../utils/trim.js');

const output = (txt) => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

describe('Fangs', () => {
  it('should translate simple table', () => {
    const fangContent = new Fangs(content);
    expect(output(fangContent.getTranslated())).to.equal(output(`
    Select field label
    <span class="announce">
    Option 1
      collapsed option button</span>   
    Option 1
    <span class="announce">menu item</span>   
    Option 2
    <span class="announce">menu item</span>   
    Option 3
    <span class="announce">menu item</span> 
       `));
  });
});