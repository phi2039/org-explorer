const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.(svg|ico|icns)$/,
  loader: 'file-loader',
  options: {
    name: '[path][name].[ext]',
  },
});

rules.push({
  test: /\.(jpg|png|woff|woff2|eot|ttf)$/,
  loader: 'url-loader',
  options: {
    name: '[path][name].[ext]',
  },
});

module.exports = {
  module: {
    rules,
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  node: {
    __dirname: true,
  },
};
