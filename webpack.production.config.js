var webpack = require('webpack')
var path = require('path')

var BUILD_DIR = path.resolve(__dirname, 'src/client/public/js')
var APP_DIR = path.resolve(__dirname, 'src/client/app')

module.exports = {
  entry: APP_DIR + '/main.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
          compact: false
        }
      },
      { 
        test: /\.css$/, 
        loader: 'style!css' 
      },
      { 
        test: /\.png$/, 
        loader: 'url?limit=100000' 
      },
      { 
        test: /\.jpg$/, 
        loader: 'file'
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=10000&mimetype=application/font-woff&name=../fonts/[name].[ext]'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=10000&mimetype=application/octet-stream&name=../fonts/[name].[ext]'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'file?name=../fonts/[name].[ext]'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=10000&mimetype=image/svg+xml&name=../fonts/[name].[ext]'
      }
    ]
  },
  plugins:[
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings: true
      }
    })
  ]
}