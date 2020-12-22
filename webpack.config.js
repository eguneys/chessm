const pkg = require('./package.json');
var path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const devConfig = {
  mode: 'development',
  entry: [
    path.resolve(__dirname, 'src') + '/devboot.js'
  ],
  devServer: {
    hot: true,
    inline: true,
    host: '0.0.0.0',
  },
  output: {
    filename: 'bundle.js',
    libraryTarget: 'var',
    library: 'Tetris',
  },
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: 'babel-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      },{
        test: /\.(jpe?g|png|gif|svg|json)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            esModule: false
          }
        }]
      },
      {
        test: /\.(frag?g|vert)$/i,
        use: 'raw-loader'
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'],
        exclude: path.resolve(__dirname, './node_modules/')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'head'
    }),
    new webpack.HotModuleReplacementPlugin({}),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(pkg.version)
    })
  ]
};

const prodConfig = {
  entry: [
    path.resolve(__dirname, 'src') + '/boot.js'
  ],
  mode: 'production',
  output: {
    filename: 'bundle.js',
    libraryTarget: 'var',
    library: 'Tetris',
  },
  devtool: 'none',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: 'babel-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      },{
        test: /\.(jpe?g|png|gif|svg|json)$/i,
        use: 'file-loader'
      },
      {
        test: /\.(frag?g|vert)$/i,
        use: 'raw-loader'
      },
      {
        test: /\.css?$/,
        use: [{loader: MiniCssExtractPlugin.loader, options: {}}, 'css-loader'],
        exclude: path.resolve(__dirname, './node_modules/')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'head'
    }),
    new MiniCssExtractPlugin({}),
    new CopyPlugin([
    ]),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(pkg.version)
    })
  ]
};

const prodUmdConfig = {
  entry: [
    path.resolve(__dirname, 'src') + '/boot.js'
  ],
  mode: 'production',
  output: {
    filename: 'bundle_umd.js',
    libraryTarget: 'umd',
  },
  devtool: 'none',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: 'babel-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      },{
        test: /\.(jpe?g|png|gif|svg|json)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.(frag?g|vert)$/i,
        use: 'raw-loader'
      },
      {
        test: /\.css?$/,
        use: [{loader: MiniCssExtractPlugin.loader, options: {}}, 'css-loader'],
        exclude: path.resolve(__dirname, './node_modules/')
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({}),
    new CopyPlugin([
    ]),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(pkg.version)
    })
  ]
};

module.exports = (env) => {
  switch (env) {
  case 'production':
    return [prodConfig, prodUmdConfig];
  default:
    return devConfig;
  }
};
