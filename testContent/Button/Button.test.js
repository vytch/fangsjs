const expect = require('expect.js');
const content = require('./Button.js');
const Fangs = require('../../index.js');
const trim = require('../../utils/trim.js');

const output = (txt) => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

describe('Fangs', () => {
  it('should translate Button', () => {
    const fangContent = new Fangs(content);
    expect(output(fangContent.getTranslated())).to.equal(output(`
      Submit <span class="announce">Button</span>
    `));
  });
});