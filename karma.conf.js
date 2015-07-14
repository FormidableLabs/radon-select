'use strict';

var path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],
    files: [
      'test/helpers/**/*.js',
      'test/spec/**/*.js'
    ],
    preprocessors: {
      'test/spec/**/*.js': ['webpack']
    },
    webpack: {
      cache: true,
      module: {
        preLoaders: [{
          test: /\.jsx$/,
          loader: 'babel-loader',
          include: path.resolve('test')
        }],
        loaders: [{
          test: /\.jsx$/,
          loader: 'babel-loader',
          exclude: [/node_modules/]
        }]
      },
      resolve: {
        root: [path.join(__dirname, '/src')],
        modulesDirectories: ['node_modules', 'modules'],
        extensions: ['', '.js', '.jsx']
      }
    },
    webpackServer: {
      quiet: false,
      noInfo: true,
      stats: {
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
      }
    },
    exclude: [],
    port: 8080,
    logLevel: config.LOG_INFO,
    browserNoActivityTimeout: 60000,
    colors: true,
    autoWatch: false,
    browsers: ['PhantomJS'],
    reporters: ['mocha'],
    plugins: [
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-phantomjs-shim',
      'karma-phantomjs-launcher',
      'karma-sinon-chai',
      'karma-webpack'
    ],
    captureTimeout: 100000,
    singleRun: true
  });
};
