const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options:{
              fallback: "file-loader",
              name: "[name][md5:hash].[ext]",
              outputPath: 'assets/',
              publicPath: '/assets/'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias:{
      'assets': path.resolve(__dirname, 'public/assets'),
      'styles': path.resolve(__dirname, 'src/styles')
    }
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
};