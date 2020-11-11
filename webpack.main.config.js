const rules = require('./webpack.rules');

rules.push({
  test: /\.node$/,
  use: 'node-loader',
});

// rules.push({
//   test: /\.(m?js|node)$/,
//   exclude: /(.webpack|node_modules)/,
//   parser: { amd: false },
//   use: {
//     loader: '@marshallofsound/webpack-asset-relocator-loader',
//     options: {
//       outputAssetBase: 'native_modules',
//     },
//   },
// });

module.exports = {
  entry: './src/electron/main.js',
  module: {
    rules,
  },
  node: {
    __dirname: true,
  },
};
