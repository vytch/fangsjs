
import content from './AriaHidden';
import {Fang} from '../../..';
import trim from '../../../utils/trim';

const output = (txt:string):string => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

describe('Fangs', () => {
  it('should translate Aria Hidden', () => {
    const fangContent = new Fang(content);
    expect(output(fangContent.getTranslated())).toEqual(output(`
      <span class=\'announce\'>*pause*</span> To display
      <span class=\'announce\'>*pause*</span> To display too
    `));
  });
});
