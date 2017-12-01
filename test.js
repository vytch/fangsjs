const Fangs = require('./index.js');
const juice = require('juice');
const fs = require('fs');

console.log('starting');
var style = fs.readFileSync('./testStyles/bootstrap.css', 'utf8');

// const result = juice.inlineContent(, style);

content = `
<div class="ctrl-holder">
  <label for="display-2">
    Text field label
  </label>
  <div class="ctrl">
    <input type="text" name="display-2" id="display-2" class="text"/>
  </div>
</div>`;

const fangContent = new Fangs(content);
console.log(fangContent.render());
console.log(fangContent.getTranslated());