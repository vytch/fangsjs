import {Fang} from '../..';
import trim from '../../utils/trim';
const output = (txt:string):string => {
  return trim(txt).replace(/\s+/g, ' ').replace(/"/g, '\'');
}

describe('voiceOver', () => {
  describe('image', () => {
    it('does work', () => {
      const content = `<img alt="vytch" src="test.jpg" />`;
      const fangContent = new Fang(content);
      expect(output(fangContent.getTranslated())).toEqual(
        `vytch<span class='announce'> Image</span>`
      );
    });
  });
});
