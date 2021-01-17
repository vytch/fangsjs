const fs = require('fs');
const path = require('path');

module.exports = {
  description: 'Add a component to the app',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the component?'
    },
  ],
  actions: (data) => {
    const rootPath = `../../src/providers/helpers/{{properCase name}}`;
    return [{
      type: 'add',
      path: `${rootPath}/{{properCase name}}.ts`,
      templateFile: './component/component.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: `${rootPath}/{{properCase name}}.test.ts`,
      templateFile: './component/component.test.js.hbs',
      abortOnFail: true,
    }

    ];
  },
};
