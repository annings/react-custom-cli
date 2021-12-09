const j = require('jscodeshift');

module.exports = (content, { imports }) => {
    const root = j(content);

    const toImportHash = (node) =>
        JSON.stringify({
            specifiers: node.specifiers.map((s) => s.local.name),
            source: node.source.raw,
        });

    const toImportAST = (i) => {
        return j(`${i}\n`).nodes()[0].program.body[0];
    };

    const declarations = root.find(j.ImportDeclaration);

    const importSet = new Set(declarations.nodes().map(toImportHash));
    const nonDuplicates = (node) => !importSet.has(toImportHash(node));

    const importASTNodes = imports.map(toImportAST).filter(nonDuplicates);

    if (declarations.length) {
        declarations
            .at(-1)
            .forEach(({ node }) => delete node.loc)
            .insertAfter(importASTNodes);
    } else {
        root.get().node.program.body.unshift(...importASTNodes);
    }

    // const importStatement = j.importDeclaration(
    //     [j.importSpecifier(j.identifier('jiangtong'))],
    //     j.literal('baili'),
    // );

    // root.get().node.program.body.unshift(importStatement);

    return root.toSource();
};
