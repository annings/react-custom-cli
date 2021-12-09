module.exports = (generator, options = {}) => {
    generator.injectImports(
        generator.entryFile,
        `import { Router } from 'react-router-dom';`,
    );

    generator.injectImports(
        generator.entryFile,
        `import Root, {history} from './routes';`,
    );

    generator.injectRootOptions(generator.entryFile, 'Router');

    generator.extendPackage({
        dependencies: {
            'react-router': '^5.1.2',
            history: '^4.10.1',
            'react-router-dom': '^5.1.2',
        },
        devDependencies: {
            '@types/react-router-dom': '^5.1.5',
        },
    });

    generator.render('./template', {
        historyMode: options.historyMode,
    });
};
