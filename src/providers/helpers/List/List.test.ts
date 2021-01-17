import content from './List';
import contentNumbered from './List.numbered'
import {Fang} from '../../..';
import trim from '../../../utils/trim';

const output = (txt:string):string => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

describe('Fangs', () => {
  it('should translate List', () => {
    const fangContent = new Fang(content);
    expect(output(fangContent.getTranslated())).toEqual(output(`
      <span class="announce">List of 2 items</span>
      <span class="announce">bullet</span> Item 1
      <span class="announce">bullet</span> Item 2
      <span class="announce">List end</span>
    `));
  });

  it('should translate numbered list', () => {
    const fangContent = new Fang(contentNumbered);
    expect(output(fangContent.getTranslated())).toEqual(output(`
      <span class="announce">List of 2 items</span>
      <span class="announce">1</span> Item 1
      <span class="announce">2</span> Item 2
      <span class="announce">List end</span>
    `));
  });
});
