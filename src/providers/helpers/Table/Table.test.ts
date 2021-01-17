import content from './Table';
import {Fang} from '../../..';
import trim from '../../../utils/trim';

const output = (txt:string):string => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

// TODO add test summary and caption

describe('Fangs', () => {
  it('should translate Table', () => {
    const fangContent = new Fang(content);
    expect(output(fangContent.getTranslated())).toEqual(output(`
      <span class="announce">Table with 2 columns and 2 rows</span>
      <span class="announce">Row 1 of 3</span>
      <span class="announce">Col 1 of 2</span>
        My head1
       <span class="announce">Col 2 of 2</span>
        My head2
       <span class="announce">Row 2 of 3</span>  <span class="announce">Col 1 of 2</span>
        Value 1a
       <span class="announce">Col 2 of 2</span>
        Value 2a
       <span class="announce">Row 3 of 3</span>  <span class="announce">Col 1 of 2</span>
        Value 1b
       <span class="announce">Col 2 of 2</span>
        Value 2b
       <span class="announce">Table end</span>
    `));
  });
});
