# Fangs.js

This is an update from Fangs, by Peter Krantz.

Fangs is a screenreader emulator. It basically turn any HTML mark up as a string and return a screenreader transcript.

This version supports:

- CSS visibility
- ARIA attributes
- Role attribute
- Multiple provider (although only VoiceOver is implemented)

## Why fang.js

There are already a lot of tools to test your page's accessibility. I also use those tools a lot.

However there was a need to test if my projects were not just complient, but also meaningful to most screen readers.

This is why I had a look at Fangs.

This was, in my styleguide, I can review hown my component dispalys on screen, and also how it will read on a screenreader: ![Styleguide](/assets/screenshot.png?raw=true "Screenshot of a styleguide")

## Installation

```
  npm install fangs.js
```

## Usage

What fangs does is to transform an HTML content into a screenreader transcript.

```
//ES6
import Fangs from 'fangs.js';

const content = `
  <div>
    <h1>H1 Title</h1>
    <h2>H2 Title</h2>
    <h3>H3 Title</h3>
    <h4>H4 Title</h4>
    <h5>H5 Title</h5>
    <h6>H6 Title</h6>
  </div>
`

const fangContent = new Fangs(content);

console.log(fangContent.getTranslated());

/* outputs:
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
*/
```

## Aria-hidden

HTML can be hidden using aria-hidden as expected:

```
//ES6
import Fangs from 'fangs.js';

const content = `
  <p>To display</p>
  <p aria-hidden="true">aria-hidden</p>
  <p aria-hidden="false">To display too</p>
`

const fangContent = new Fangs(content);

console.log(fangContent.getTranslated());

/* outputs:
  <span class=\'announce\'>*pause*</span> To display
  <span class=\'announce\'>*pause*</span> To display too
*/
```

## CSS support

Sometime, context can be hidden with CSS. It should not be displayed then. There is an option to pass the CSS of your site as a second paramater. Note that CSS is a string.

Behind the hood, we are using juice.js to apply CSS to the HTML.

```
const Fangs = require('./index.js');
const juice = require('juice');
const fs = require('fs');

// Getting the CSS
var style = `
  .to-hide {
    display: none;
  }
`;

content = `
  <div class="to-show">
   Displayed content
  </div>
  <div class="to-hide">
   Hidden content
  </div>
`;

const fangContent = new Fangs(content, style);
console.log(fangContent.render());
/* outputs:
  <div class="to-show">
   Displayed content
  </div>
  <div class="to-hide" style="display:none">
   Hidden content
  </div>
*/

console.log(fangContent.getTranslated());
/* outputs:
  Displayed content
*/
```

## Contribute

Not all aria tags are supported at the moment. You are welcome to contribute to this project.

If you want to contribute, please use the generator provided in this project.

```
npm run plop
```

Run the test:

```
npm run test
```
