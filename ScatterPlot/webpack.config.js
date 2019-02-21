const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  entry: __dirname + '/js/index.jsx',
  output: {
    path: __dirname + '/bundle',
    filename: 'bundle.js',
  },
  resolve : {
    extensions: ['.js', '.jsx', '.css']
  },
  module: {
    rules:[
      {
        test: /\.(js|jsx)$/,
        exclude: /node-modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use:{
          loader: 'file-loader',
        }
      }
    ]
  },
  plugins:[
    new MiniCssExtractPlugin({
      filename: '/bundle/styles.css'
    })
  ]

}

module.exports = config;
