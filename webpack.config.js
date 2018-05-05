var path = require('path');
var webpack = require('webpack');
var Uglify = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    'client/main': './src/client/main.js',
    'server/main': './src/server/main.js'
  },
  output: {
    library: 'mmommo',
    libraryTarget: 'var',
    path: path.resolve(__dirname, 'app'),
    filename: '[name].js'
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new Uglify({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
    ]
  },
  stats: {
      colors: true
  }
};
