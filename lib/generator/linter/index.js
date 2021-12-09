module.exports = (generator, options = {}) => {
    generator.extendPackage({
        devDependencies: {
            '@typescript-eslint/eslint-plugin': '^4.4.1',
            '@typescript-eslint/parser': '^4.4.1',
            eslint: '^7.11.0',
            'eslint-config-airbnb': '^18.2.0',
            'eslint-config-prettier': '^6.12.0',
            'eslint-plugin-import': '^2.22.1',
            'eslint-plugin-jsx-a11y': '^6.4.1',
            'eslint-plugin-prettier': '^3.1.4',
            'eslint-plugin-react': '^7.21.4',
            'eslint-plugin-react-hooks': '^4.1.2',
            'eslint-webpack-plugin': '^2.5.2',
            prettier: '^2.1.2',
        },
        scripts: {
            fix: 'eslint --ext .js,.ts,.tsx,.jsx src/ --fix',
        },
    });
    generator.render('./template');
};
