const map = {
    scss: {
        sass: '^1.27.0',
        'sass-loader': '^10.0.3',
        'sass-resources-loader': '^2.1.1',
    },
    less: {
        less: '^3.12.2',
        'less-loader': '^7.0.2',
    },
};

module.exports = (generator, { cssType }) => {
    generator.extendPackage({
        devDependencies: {
            postcss: '^8.3.0',
            'postcss-custom-properties': '^9.1.1',
            'postcss-loader': '^4.0.4',
            'postcss-preset-env': '^6.7.0',
            'postcss-pxtorem': '^6.0.0',
            ...map[cssType],
        },
    });
    generator.render('./template');
};
