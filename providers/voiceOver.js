import ElFactory from './helpers/voiceOver';

const trim = require('../utils/trim.js');
const GetSiblingOrder = require('../utils/GetSiblingOrder.js');
const ChildElementCount = require('../utils/ChildElementCount.js');
const cheerio = require('cheerio');

class VoiceOverProvider {

  get(el){
    return ElFactory.El(el);
  }
}


module.exports = VoiceOverProvider;
