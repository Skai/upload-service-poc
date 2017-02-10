var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path')

module.exports = merge(baseConfig, {
  output: {
    path: config.build.assetsRoot,
    publicPath: '/',
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
  ]
})
