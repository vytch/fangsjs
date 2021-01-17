import content from './InputRadio';
import {Fang} from '../../..';
import trim from '../../../utils/trim';

const output = (txt:string):string => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

describe('Fangs', () => {
  it('should translate input radio', () => {
    const fangContent = new Fang(content);
    expect(output(fangContent.getTranslated())).toEqual(output(`
      <span class="announce">Radio buttons, selected, 1 of 3</span> Email
      <span class="announce">Radio buttons, 2 of 3</span> Phone
      <span class="announce">Radio buttons, 3 of 3</span> Mail
    `));
  });
});
