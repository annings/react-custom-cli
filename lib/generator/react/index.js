module.exports = (generator, options = {}) => {
    if (options.features.indexOf('router') < 0) {
        generator.injectImports(
            generator.entryFile,
            `import Index from './pages/Index';`,
        );

        generator.injectRootOptions(generator.entryFile, 'Index');
    }

    generator.extendPackage({
        devDependencies: {
            '@types/react': '^17.0.11',
            '@types/react-dom': '^17.0.8',
            '@pmmmwh/react-refresh-webpack-plugin': '^0.4.3',
            'react-refresh': '^0.10.0',
        },
        dependencies: {
            react: '^17.0.1',
            'react-dom': '^17.0.1',
        },
    });

    generator.render('./template');
};
