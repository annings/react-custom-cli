module.exports = (api) => {
    api.injectFeature({
        name: 'Commitizen',
        value: 'commitizen',
        short: 'commitizen',
        description: '代码提交审查',
        link: 'https://github.com/commitizen/cz-cli',
    });
};
