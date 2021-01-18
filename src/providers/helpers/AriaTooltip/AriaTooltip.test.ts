import content from './AriaTooltip';
import {Fang} from '../../..';
import trim from '../../../utils/trim';

const output = (txt:string):string => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

describe('Fangs', () => {
  it('should translate Aria tooltip', () => {
    const fangContent = new Fang(content);
    expect(output(fangContent.getTranslated())).toEqual(output(`
      Some content <span class="announce">Tooltip</span>
    `));
  });
});
