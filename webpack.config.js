const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'none',
  target: 'node',
  devtool: 'sourcemap',
  entry: {
    index: path.resolve(__dirname, 'src/index'),
    mock: path.resolve(__dirname, 'src/index.mock'),
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    library: '',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          'babel-loader',
          'eslint-loader'
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  externals: [
    nodeExternals(),
    'react',
  ],
}
