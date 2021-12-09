module.exports = (generator, options = {}) => {
    generator.extendPackage({
        devDependencies: {
            commitizen: '^4.2.1',
            '@commitlint/cli': '^13.0.0',
            '@commitlint/config-conventional': '^13.0.0',
            'cz-conventional-changelog': '^3.3.0',
            'cz-customizable': '^6.3.0',
            husky: '^7.0.1',
        },

        config: {
            commitizen: {
                path: 'node_modules/cz-customizable',
            },
            'cz-customizable': {
                config: '.cz-config.js',
            },
        },

        scripts: {
            prepare: 'husky install',
        },
    });

    generator.render('./template');
};
