// const execa = require('execa');

// module.exports = function executeCommand(cwd) {
//     return new Promise((resolve, reject) => {
//         const child = execa('npm', ['install'], {
//             cwd,
//             stdio: ['inherit', 'pipe', 'inherit'],
//         });

//         child.stdout.on('data', buffer => {
//             process.stdout.write(buffer);
//         });

//         child.on('close', code => {
//             if (code !== 0) {
//                 // reject(new Error(`command failed: ${command}`));
//                 return;
//             }

//             resolve();
//         });
//     });
// };

const which = require('which');
const { spawn } = require('child_process');

function findNpm() {
    const npms =
        process.platform === 'win32'
            ? ['yarn.cmd', 'tnpm.cmd', 'cnpm.cmd', 'npm.cmd', 'pnpm.cmd']
            : ['yarn', 'tnpm', 'cnpm', 'npm', 'pnpm'];
    for (var i = 0; i < npms.length; i++) {
        try {
            which.sync(npms[i]);
            console.log('use npm: ' + npms[i]);
            return npms[i];
        } catch (e) {}
    }
    throw new Error('please install npm');
}

module.exports = (cwd) => {
    return new Promise((resolve) => {
        const npm = findNpm();

        const runner = spawn(which.sync(npm), ['install'], {
            cwd,
            stdio: 'inherit',
        });
        runner.on('close', function (code) {
            resolve();
        });
    });
};
