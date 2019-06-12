const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpackDashboard = require('webpack-dashboard/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const hasAPI = false;

let dir = "";

if (hasAPI) {
  dir = 'server/public'
} else {
  dir = 'dist'
}

const copy = new CopyWebpackPlugin(
  [
    {
      from: `./src/assets`,
      to: `./assets`,
    },
    {
      from: `./src/**.html`,
      to: `./`,
      flatten: true,
    },
  ],
  {
    ignore: [`.DS_Store`],
  },
);

module.exports = {
  entry: ['./src/js/index.js', './src/css/style.scss'],

  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, dir),
  },

  resolve: {
    extensions: [`.js`, `.css`, `.ts`],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: `babel-loader`,
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract([
          'css-loader',
          'sass-loader'
        ]),
      },
      {
        test: /\.html$/,
        loader: `html-loader`,
        options: {
          attrs: [`audio:src`, `img:src`, `video:src`, `source:srcset`], // read src from video, img & audio tag
        },
      },
    ],
  },

  plugins: [copy, new CleanWebpackPlugin([dir]), new webpackDashboard(), new ExtractTextPlugin({ // define where to save the file
    filename: 'css/[name].bundle.css',
    allChunks: true,
  })],
};
