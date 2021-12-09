/** @format */

const path = require('path');
const fs = require('fs');
const os = require('os');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
require('dotenv').config({ path: '.env.development' });

module.exports = {
    // 根的js
    appIndexJs: resolveApp('src/index.tsx'),

    // favicon 路径
    favicon: resolveApp('public/ico.ico'),
    // 根html
    appHtml: resolveApp('public/index.html'),

    // 打包文件夹
    appbuild: resolveApp('dist'),
    // 配置目录
    config: resolveApp('config'),

    //node_modules
    appNodeModules: resolveApp('node_modules'),
    tsConfig: resolveApp('tsconfig.json'),
    // 项目主目录
    appSrc: resolveApp('src'),

    // 默认开启的本地项目端口号
    port: process.env.PORT,
    // 手动配置打开的host
    host: process.env.HOST,

    // 需要代理
    proxy: {
        '/': {
            target: process.env.RequestUrl,
            secure: false,
            changeOrigin: true,
            pathRewrite: { '^/dev-api': '/' },
        },
    },
};
