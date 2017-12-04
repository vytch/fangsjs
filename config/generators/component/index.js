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
    const rootPath = `../../testContent/{{properCase name}}`;
    console.log(data);
    return [{
      type: 'add',
      path: `${rootPath}/{{properCase name}}.js`,
      templateFile: './component/component.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: `${rootPath}/{{properCase name}}.test.js`,
      templateFile: './component/component.test.js.hbs',
      abortOnFail: true,
    }

    ];
  },
};
