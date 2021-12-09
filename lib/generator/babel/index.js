module.exports = (generator, options = {}) => {
  generator.extendPackage({
    devDependencies: {
      '@babel/plugin-proposal-class-properties': '^7.10.4',
      '@babel/plugin-proposal-decorators': '^7.10.5',
      '@babel/plugin-proposal-optional-chaining': '^7.11.0',
      '@babel/plugin-syntax-dynamic-import': '^7.8.3',
    },
  });
  generator.render('./template');
};
