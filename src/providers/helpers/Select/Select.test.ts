import content from './Select';
import {Fang} from '../../..';
import trim from '../../../utils/trim';

const output = (txt:string):string => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

describe('Fangs', () => {
  it('should translate select', () => {
    const fangContent = new Fang(content);
    expect(output(fangContent.getTranslated())).toEqual(output(`
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
