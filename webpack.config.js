var webpack = require('webpack')
var path = require('path')
var CopyWebpackPlugin = require('copy-webpack-plugin')

var BUILD_DIR = path.resolve(__dirname, 'build')
var APP_DIR = path.resolve(__dirname, 'src')

module.exports = {
  entry: path.resolve(APP_DIR + '/app/main.js'),
  output: {
    path: path.resolve(BUILD_DIR + '/public/js'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?/,
        loader: 'babel-loader',
        query: {
          presets: ['react'],
          compact: false
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=../fonts/[name].[ext]'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=../fonts/[name].[ext]'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?name=../fonts/[name].[ext]'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=../fonts/[name].[ext]'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'src/public',
        to: '../'
      },
      {
        from: 'src/index.js',
        to: '../../'
      },
      {
        from: 'src/currentTempsServer.json',
        to: '../../'
      },
      {
        from: 'src/mongoServer.json',
        to: '../../'
      }
    ])
  ]
}
