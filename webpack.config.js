var webpack = require('webpack');

module.exports = {
  debug: true,
  devtool: 'source-map',
  entry: {
      index: './src/index.ts'
  },
  output: {
    library: 'Vux',
    libraryTarget: 'umd',
    filename: './dist/vux.js'
  },
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.(tsx?)$/, loader: 'ts-loader?configFileName=./tsconfig.json' }
    ]
  }
};
