import content from './InputCheckbox';
import {Fang} from '../../..';
import trim from '../../../utils/trim';

const output = (txt:string):string => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

describe('Fangs', () => {
  it('should translate Input Checkbox', () => {
    const fangContent = new Fang(content);
    expect(output(fangContent.getTranslated())).toEqual(output(`
      <span class="announce"> checked, tickbox</span> Subscribe to newsletter?
    `));
  });
});
