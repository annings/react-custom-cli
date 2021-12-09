const j = require('jscodeshift');

module.exports = (content, { injections }) => {
    const root = j(content);
    let wrapper;
    let routerWrapper;
    let reduxWrapper;
    const hasRouter = injections.indexOf('Router') >= 0;
    const hasRedux = injections.indexOf('Redux') >= 0;

    const IndexWrapper = j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier('Index')),
        j.jsxClosingElement(j.jsxIdentifier('Index')),
    );

    if (hasRouter) {
        routerWrapper = j.jsxElement(
            j.jsxOpeningElement(j.jsxIdentifier('Router'), [
                j.jsxAttribute(
                    j.jsxIdentifier('history'),
                    j.jsxExpressionContainer(j.identifier('history')),
                ),
            ]),
            j.jsxClosingElement(j.jsxIdentifier('Router')),
            [
                j.jsxElement(
                    j.jsxOpeningElement(j.jsxIdentifier('Root')),
                    j.jsxClosingElement(j.jsxIdentifier('Root')),
                ),
            ],
        );
    }

    if (hasRedux) {
        reduxWrapper = j.jsxElement(
            j.jsxOpeningElement(j.jsxIdentifier('Provider'), [
                j.jsxAttribute(
                    j.jsxIdentifier('store'),
                    j.jsxExpressionContainer(j.identifier('store')),
                ),
            ]),
            j.jsxClosingElement(j.jsxIdentifier('Provider')),
            hasRouter ? [routerWrapper] : [IndexWrapper],
        );
    }

    const jsxAst = root
        .find(j.VariableDeclarator)
        .filter(v => {
            return v.node.id.name === 'App';
        })
        .find(j.ReturnStatement)
        .find(j.JSXFragment)
        .get().node.children;

    if (hasRedux) {
        wrapper = reduxWrapper;
    } else if (hasRouter) {
        wrapper = routerWrapper;
    } else {
        wrapper = IndexWrapper;
    }

    jsxAst.unshift(wrapper);

    // outer.find(j.JSXElement).forEach((p) => {
    //     p.node.children.push(...injections);
    // });

    // outer.get().node.children = injections;
    // console.log(outer.get().node.children);
    // let pContent = j(injections[0]);
    // pContent.get().node.children = [wrapper];
    // let reduceRight = j('<div></div>');
    // reduceRight.get().node.children = b;
    // console.log(reduceRight);

    // jsxAst.splice(-1, 0, outer.get().node);

    // let a = j(`<Provider></Provider>`)
    //     .find(j.JSXElement)
    //     .forEach((p) => {
    //         p.node.children = '<div>1111</div>';
    //     });

    // console.log(a);
    // const jsxAst = root
    //     .find(j.VariableDeclarator)
    //     .filter((v) => {
    //         return v.node.id.name === 'App';
    //     })
    //     .find(j.ReturnStatement)
    //     .find(j.JSXFragment)
    //     .forEach((path) => {
    //         path.node.children.push(wrapper);
    //     });

    // jsxAst.replaceWith(reduxAst);

    // let reducChildren = reduxAst.find(j.JSXElement).get().node.children;
    // reducChildren.splice(0, 1, '<div>11</div>');

    //

    // jsxAst.replaceWith(`${injections[injections.length - 1]}`);

    return root.toSource();
};
