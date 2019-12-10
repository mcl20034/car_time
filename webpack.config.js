const webpack = require("webpack");
const fs = require("fs");
const path = require("path");
const baseDir = process.cwd();
const srcDir = path.resolve(baseDir, 'src');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const pkg = require("./package.json");
const projectName = pkg.name;
const version = pkg.version;


module.exports = function () {

  var extendConf = {
    module: {
      rules: [
        {
          test: /\.js|jsx$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        axios: "axios",
        "window.axios": "axios"
      }),
    ],
    resolve: {
      alias: {
        "axios": path.resolve(baseDir, 'node_modules/axios/dist/axios.min.js')
      }
    }
  };
  return extendConf;
};