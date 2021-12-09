const chalk = require('chalk');

module.exports = (api) => {
    api.injectFeature({
        name: 'CSS预处理器(Sass,Less)',
        value: 'styles',
        description: 'css',
    });

    api.injectPrompt({
        name: 'cssType',
        when: (answers) => answers.features.includes('styles'),
        type: 'checkbox',
        message: '选择CSS预处理器',
        description:
            'Checking code errors and enforcing an homogeoneous code style is recommended.',
        choices: () => [
            {
                name: 'SCSS',
                value: 'scss',
                short: 'scss',
            },
            {
                name: 'LESS',
                value: 'less',
                short: 'less',
            },
        ],
    });
};
