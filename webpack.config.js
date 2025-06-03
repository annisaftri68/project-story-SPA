const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    ...(isProduction ? [new WorkboxPlugin.InjectManifest({
      swSrc: './src/sw.js',
      swDest: 'sw.js'
    })] : [])
  ],
  devServer: {
    static: './dist',
    port: 8080,
    open: true,
    hot: true,
  },
};
