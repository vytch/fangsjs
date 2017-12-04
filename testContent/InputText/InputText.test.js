const expect = require('expect.js');
const content = require('./InputText.js');
const Fangs = require('../../index.js');
const trim = require('../../utils/trim.js');

const output = (txt) => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

describe('Fangs', () => {
  it('should translate Input text', () => {
    const fangContent = new Fangs(content);

    expect(output(fangContent.getTranslated())).to.equal(output(`
      Your name <span class="announce">Input text blank</span>
    `));
  });
});