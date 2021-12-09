// const slash = require('slash');

// Unix    => foo/bar
// Windows => foo\\bar

// slash(string)

// Unix    => foo/bar
// Windows => foo/bar

const slash = (path) => {
    const isExtendedLengthPath = /^\\\\\?\\/.test(path);
    const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex

    if (isExtendedLengthPath || hasNonAscii) {
        return path;
    }

    return path.replace(/\\/g, '/');
};

// 用于转换 Windows 反斜杠路径转换为正斜杠路径 \ => /
module.exports = function normalizeFilePaths(files) {
    Object.keys(files).forEach(async (file) => {
        const normalized = slash(file);
        if (file !== normalized) {
            files[normalized] = files[file];
            delete files[file];
        }
    });

    return files;
};
