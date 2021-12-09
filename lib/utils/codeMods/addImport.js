const j = require('jscodeshift');

/**
 * 添加要import的内容
 * 支持 importSpecifier importDefaultSpecifier importNamespaceSpecifier
 * @param {*} { root }
 * @param {*} { specifier, source }
 */
// type:default specifier: local           import a from 'a'
// type:named specifier: imported          import {a, b} from 'a'
// specifier: local                        import * as a from 'a'

 module.exports = ({ root }, { specifier, source }) => {
    let localBinding = '';
    if (specifier.type === 'named') {
        localBinding = specifier.local || specifier.imported;
    } else {
        localBinding = specifier.local;
    }

    let newImportSpecifier;

    if (specifier.type === 'default') {
        newImportSpecifier = j.importDefaultSpecifier(j.identifier(specifier.local))
    } else if (specifier.type === 'named') {
        newImportSpecifier = j.importSpecifier(
            j.identifier(specifier.imported),
            j.identifier(localBinding)
        )
    } else {
        newImportSpecifier = j.importNamespaceSpecifier(j.identifier(localBinding))
    }

    const matchedDecl = root.find(j.ImportDeclaration, {
        source: {
            value: source,
        },
    })

    if (matchedDecl.length &&
        !matchedDecl.find(j.ImportNamespaceSpecifier).length) {
            matchedDecl.get(0).node.specifier.push(newImportSpecifier)
    } else {
        const newImportDecl = j.importDeclaration(
            [newImportSpecifier],
            j.stringLiteral(source)
        )

        const lastImportDecl = root.find(j.ImportDeclaration).at(-1)
        if (lastImportDecl.length) {
            lastImportDecl.insertAfter(newImportDecl)
        } else {
            root.get().node.program.body.unshift(newImportDecl)
        }
    }
}
