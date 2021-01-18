import content from './Titles';
import {Fang} from '../../..';
import trim from '../../../utils/trim';

const output = (txt:string):string => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

describe('Fangs', () => {
  it('should translate Titles', () => {
    const fangContent = new Fang(content);
    expect(output(fangContent.getTranslated())).toEqual(output(`
      <span class="announce">Heading level one</span>
    H1 Title
   <span class="announce">Heading level two</span>
    H2 Title
   <span class="announce">Heading level three</span>
    H3 Title
   <span class="announce">Heading level four</span>
    H4 Title
   <span class="announce">Heading level five</span>
    H5 Title
   <span class="announce">Heading level six</span>
    H6 Title
    `));
  });
});
