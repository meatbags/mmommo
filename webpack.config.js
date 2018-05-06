var path = require('path');
var webpack = require('webpack');
var Uglify = require('uglifyjs-webpack-plugin');

var clientConfig = {
  entry: {
    'app.min': './client/src/main.js'
  },
  output: {
    library: 'mmommo',
    libraryTarget: 'var',
    path: path.resolve(__dirname, "client/build/"),
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
      colors: true,
      warnings: false
  }
};

var serverConfig = {
  target: 'node',
  entry: {
    'app.min': './server/src/main.js'
  },
  output: {
    library: 'mmommo',
    libraryTarget: 'var',
    path: path.resolve(__dirname, "server/build/"),
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
    colors: true,
    warnings: false
  }
};

module.exports = [ clientConfig, serverConfig ];
