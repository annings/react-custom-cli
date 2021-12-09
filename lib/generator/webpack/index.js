module.exports = (generator, options = {}) => {
    generator.extendPackage({
        scripts: {
            start:
                'cross-env NODE_ENV=development webpack serve --config ./build/webpack.config.dev.js',
            build:
                'cross-env NODE_ENV=production webpack --config ./build/webpack.config.prod.js',
        },
        devDependencies: {
            'clean-webpack-plugin': '^3.0.0',
            chalk: '^4.1.0',
            os: '^0.1.1',
            path: '^0.12.7',
            'fork-ts-checker-notifier-webpack-plugin': '^3.0.0',
            'fork-ts-checker-webpack-plugin': '^6.2.1',
            'tsconfig-paths-webpack-plugin': '^3.3.0',
            typescript: '^4.3.5',
            '@babel/preset-typescript': '^7.10.4',
            'progress-bar-webpack-plugin': '^2.1.0',
            dotenv: '^10.0.0',
            portfinder: '^1.0.28',
            'thread-loader': '^3.0.0',
            'cache-loader': '^4.1.0',
            '@babel/preset-env': '^7.11.5',
            'mini-css-extract-plugin': '^2.3.0',
            '@babel/plugin-transform-runtime': '^7.11.5',
            '@babel/core': '^7.14.8',
            'terser-webpack-plugin': '^5.2.0',
            'css-minimizer-webpack-plugin': '^3.0.2',
            'clean-webpack-plugin': '^3.0.0',
            'compression-webpack-plugin': '^8.0.1',
            '@babel/runtime-corejs3': '^7.11.2',
            '@babel/preset-react': '^7.10.4',
            'babel-loader': '^8.1.0',
            'cross-env': '^7.0.2',
            'clean-webpack-plugin': '^3.0.0',
            'css-loader': '^5.0.2',
            'file-loader': '^6.2.0',
            'url-loader': '^4.1.1',
            'html-webpack-plugin': '^4.5.0',
            'style-loader': '^2.0.0',
            webpack: '^5.32.0',
            'webpack-bundle-analyzer': '^3.9.0',
            'webpack-cli': '^4.6.0',
            'webpack-dev-server': '^4.0.0',
            'webpack-merge': '^5.2.0',
        },
    });

    generator.render('./template', {
        linter: options.features.includes('linter'),
        scss: options.features.includes('scss'),
        less: options.features.includes('less'),
    });
};
