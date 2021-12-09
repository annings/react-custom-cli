const chalk = require('chalk');

module.exports = (api) => {
    api.injectFeature({
        name: 'Router',
        value: 'router',
        description: 'Structure the app with dynamic pages',
        link: 'https://reactrouter.com/',
    });

    api.injectPrompt({
        name: 'historyMode',
        when: (answers) => answers.features.includes('router'),
        type: 'confirm',
        message: `是否启用history模式`,
        description: `By using the HTML5 History API, the URLs don't need the '#' character anymore.`,
        link: 'https://reactrouter.com/',
    });
};
