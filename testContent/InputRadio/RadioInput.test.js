const expect = require('expect.js');
const content = require('./RadioInput.js');
const Fangs = require('../../index.js');
const trim = require('../../utils/trim.js');

const output = (txt) => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

describe('Fangs', () => {
  it('should translate radioInput', () => {
    const fangContent = new Fangs(content);
    expect(output(fangContent.getTranslated())).to.equal(output(`
      <span class="announce">Radio buttons, selected, 1 of 3</span> Email 
      <span class="announce">Radio buttons, 2 of 3</span> Phone 
      <span class="announce">Radio buttons, 3 of 3</span> Mail
    `));
  });
});