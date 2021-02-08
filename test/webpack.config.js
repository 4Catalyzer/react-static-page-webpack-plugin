/* eslint-disable */
const { rules, plugins } = require('webpack-atoms');

const Plugin = require('../index');

module.exports = {
  entry: `${__dirname}/index.js`,
  output: {
    path: `${__dirname}/build`,
    publicPath: '/',
    filename: 'test.js',
    libraryTarget: 'commonjs',
  },
  module: {
    rules: [
      rules.js({
        presets: ['@babel/preset-react'],
      }),
      rules.css({ extract: true }),
    ],
  },
  plugins: [
    plugins.extractCss(),
    new Plugin({ fileName: 'test.html', title: 'test!', inlineCss: false }),
  ],
};
