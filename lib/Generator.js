const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const isObject = (val) => val && typeof val === 'object';
const { isBinaryFileSync } = require('isbinaryfile');
const normalizeFilePaths = require('./utils/normalizeFilePaths');
const writeFileTree = require('./utils/writeFileTree');
const sortObject = require('./utils/sortObject');
const injectImports = require('./utils/codeMods/injectImports');
const injectOptions = require('./utils/codeMods/injectOptions');
const ConfigTransform = require('./ConfigTransform');

const ensureEOL = (str) => {
    if (str.charAt(str.length - 1) !== '\n') {
        return str + '\n';
    }

    return str;
};

const defaultConfigTransforms = {
    babel: new ConfigTransform({
        file: {
            js: ['babel.config.js'],
        },
    }),
    postcss: new ConfigTransform({
        file: {
            js: ['postcss.config.js'],
            json: ['.postcssrc.json', '.postcssrc'],
            yaml: ['.postcssrc.yaml', '.postcssrc.yml'],
        },
    }),
    eslintConfig: new ConfigTransform({
        file: {
            js: ['.eslintrc.js'],
            json: ['.eslintrc', '.eslintrc.json'],
            yaml: ['.eslintrc.yaml', '.eslintrc.yml'],
        },
    }),
    jest: new ConfigTransform({
        file: {
            js: ['jest.config.js'],
        },
    }),
    browserslist: new ConfigTransform({
        file: {
            lines: ['.browserslistrc'],
        },
    }),
};

class Generator {
    constructor(pkg, context) {
        this.pkg = pkg;
        this.rootOptions = {};
        this.files = {};
        this.imports = {};
        this.entryFile = `src/index.tsx`;
        this.fileMiddlewares = [];
        this.context = context;
        this.configTransforms = {};
    }

    extendPackage(fields) {
        const pkg = this.pkg;
        for (const key in fields) {
            if (Object.hasOwnProperty.call(fields, key)) {
                const value = fields[key];
                const existing = pkg[key];
                if (
                    isObject(value) &&
                    (key === 'dependencies' || key === 'devDependencies' || key === 'scripts')
                ) {
                    pkg[key] = Object.assign(existing || {}, value);
                } else {
                    pkg[key] = value;
                }
            }
        }
    }

    async generate() {
        // 从 package.json 中提取文件
        this.extractConfigFiles();
        // 解析文件内容
        await this.resolveFiles();
        // 将 package.json 中的字段排序
        this.sortPkg();

        this.files['package.json'] = JSON.stringify(this.pkg, null, 2) + '\n';

        await writeFileTree(this.context, this.files);
    }

    // 按照下面的顺序对 package.json 中的 key 进行排序
    sortPkg() {
        this.pkg.dependencies = sortObject(this.pkg.dependencies);
        this.pkg.devDependencies = sortObject(this.pkg.devDependencies);
        this.pkg.scripts = sortObject(this.pkg.scripts, [
            'start',
            'build',
            'test:unit',
            'test:e2e',
            'lint',
            'deploy',
        ]);

        this.pkg = sortObject(this.pkg, [
            'name',
            'version',
            'private',
            'description',
            'author',
            'scripts',
            'husky',
            'lint-staged',
            'main',
            'module',
            'browser',
            'jsDelivr',
            'unpkg',
            'files',
            'dependencies',
            'devDependencies',
            'peerDependencies',
            'vue',
            'babel',
            'eslintConfig',
            'prettier',
            'postcss',
            'browserslist',
            'jest',
        ]);
    }

    async resolveFiles() {
        const files = this.files;
        for (const middleware of this.fileMiddlewares) {
            await middleware(files, ejs.render);
        }

        // normalize file paths on windows
        // all paths are converted to use / instead of \
        // 将反斜杠 \ 转换为正斜杠 /
        normalizeFilePaths(files);

        Object.keys(files).forEach((file) => {
            let imports = this.imports[file];
            imports = imports instanceof Set ? Array.from(imports) : imports;
            if (imports && imports.length > 0) {
                files[file] = injectImports(files[file], { imports });
            }

            let injections = this.rootOptions[file];
            injections = injections instanceof Set ? Array.from(injections) : injections;
            if (injections && injections.length > 0) {
                files[file] = injectOptions(files[file], { injections });
            }
        });
    }

    // 将 package.json 中的配置提取出来，生成单独的文件
    // 例如将 package.json 中的
    // babel: {
    //     presets: ['@babel/preset-env']
    // },
    // 提取出来变成 babel.config.js 文件
    extractConfigFiles() {
        const configTransforms = {
            ...defaultConfigTransforms,
            ...this.configTransforms,
        };

        const extract = (key) => {
            if (configTransforms[key] && this.pkg[key]) {
                const value = this.pkg[key];
                const configTransform = configTransforms[key];
                const res = configTransform.transform(value, this.files, this.context);
                const { content, filename } = res;
                // 如果文件不是以 \n 结尾，则补上 \n
                this.files[filename] = ensureEOL(content);
                delete this.pkg[key];
            }
        };

        extract('babel');
        // console.log(configTransforms);
    }

    renderFile(name, data, ejsOptions) {
        // 如果是二进制文件，直接将读取结果返回
        if (isBinaryFileSync(name)) {
            return fs.readFileSync(name);
        }

        // 返回文件内容
        const template = fs.readFileSync(name, 'utf-8');
        return ejs.render(template, data, ejsOptions);
    }

    // 导入imports
    injectImports(file, imports) {
        const _imports = this.imports[file] || (this.imports[file] = new Set());
        (Array.isArray(imports) ? imports : [imports]).forEach((imp) => {
            _imports.add(imp);
            debugger;
        });
    }

    /**
     * 在jsx中导入router provider等
     */
    injectRootOptions(file, options) {
        const _options = this.rootOptions[file] || (this.rootOptions[file] = new Set());
        (Array.isArray(options) ? options : [options]).forEach((opt) => {
            _options.add(opt);
        });
    }

    async render(source, additionalData = {}, ejsOptions = {}) {
        // 获取调用 generator.render() 函数的文件的父目录路径
        const baseDir = extractCallDir();
        source = path.resolve(baseDir, source);
        this._injectFileMiddleware(async (files) => {
            const _files = await (
                await import('globby')
            ).globby(['**/*'], {
                cwd: source,
                dot: true,
            });
            // 读取目录中的所有文件
            for (const rawPath of _files) {
                const sourcePath = path.resolve(source, rawPath);
                // 解析文件内容
                const content = this.renderFile(sourcePath, additionalData, ejsOptions);
                // only set file if it's not all whitespace, or is a Buffer (binary files)
                if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
                    files[rawPath] = content;
                }
            }
        });
    }

    _injectFileMiddleware(middleware) {
        this.fileMiddlewares.push(middleware);
    }
}

module.exports = Generator;

// 获取真实调用的目录
const extractCallDir = () => {
    const obj = {};
    Error.captureStackTrace(obj);

    // 在 lib\generator\xx 等各个模块中 调用 generator.render()
    // 将会排在调用栈中的第四个，也就是 obj.stack.split('\n')[3]
    const callSite = obj.stack.split('\n')[3];
    const namedStackRegExp = /\s\((.*):\d+:\d+\)$/;
    const anonymousStackRegExp = /at (.*):\d+:\d+$/;

    let matchResult = callSite.match(namedStackRegExp);
    if (!matchResult) {
        matchResult = callSite.match(anonymousStackRegExp);
    }

    // Error.prototype 对象包含如下属性：

    // constructor–指向实例的构造函数

    // message–错误信息

    // name–错误的名字(类型)

    const fileName = matchResult[1];

    return path.dirname(fileName);
};
