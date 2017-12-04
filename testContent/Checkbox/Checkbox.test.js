const expect = require('expect.js');
const content = require('./Checkbox.js');
const Fangs = require('../../index.js');
const trim = require('../../utils/trim.js');

const output = (txt) => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

describe('Fangs', () => {
  it('should translate checkbox', () => {
    const fangContent = new Fangs(content);
    expect(output(fangContent.getTranslated())).to.equal(output(`
      <span class="announce"> checked, tickbox</span> Subscribe to newsletter?
    `));
  });
});