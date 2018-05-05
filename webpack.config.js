var path = require('path');
var webpack = require('webpack');
var Uglify = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    'app': './client/src/main.js',
    'app.min': './client/src/main.js'
  },
  output: {
    library: 'mmommo',
    libraryTarget: 'var',
    path: path.resolve(__dirname, 'client/build/'),
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
