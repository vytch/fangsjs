const expect = require('expect.js');
const content = require('./table.js');
const Fangs = require('../../index.js');
const trim = require('../../utils/trim.js');

const output = (txt) => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

describe('Fangs', () => {
  it('should translate simple table', () => {
    const fangContent = new Fangs(content);
    expect(output(fangContent.getTranslated())).to.equal(output(`
      <span class="announce">Table with 2 columns and 2 rows</span>  
      <span class="announce">Row 1 of 3</span>  
      <span class="announce">Col 1 of 2</span>   
        My head1
       <span class="announce">Col 2 of 2</span>   
        My head2
       <span class="announce">Row 2 of 3</span>  <span class="announce">Col 1 of 2</span>   
        Value 1a
       <span class="announce">Col 2 of 2</span>   
        Value 2a
       <span class="announce">Row 3 of 3</span>  <span class="announce">Col 1 of 2</span>   
        Value 1b
       <span class="announce">Col 2 of 2</span>   
        Value 2b
       <span class="announce">Table end</span>`));
  });
});