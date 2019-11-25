const COMPRESS = false;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: COMPRESS,
    debug: false
  }),
  new ExtractTextPlugin({
    filename: 'css/[name].css',
    allChunks: true
  }),
  /**/
  new HtmlWebpackPlugin({
    template: './src/index.html'
  }),
];

if (COMPRESS) {
  plugins.push(new OptimizeCssAssetsPlugin({
    //assetNameRegExp: /\.optimize\.css$/g,
    cssProcessor: require('cssnano'),
    cssProcessorPluginOptions: {
      preset: ['default', {
        discardComments: {
          removeAll: true
        }
      }],
    },
    canPrint: true
  }));
}

module.exports = {
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/app.js'
  },
  devtool: (COMPRESS ? '' : 'source-map'),
  externals: {
    'jquery': 'jQuery',
  },
  optimization: {
    namedModules: true, // NamedModulesPlugin()
    splitChunks: { // CommonsChunkPlugin()
      name: 'vendor',
      minChunks: 2
    },
    noEmitOnErrors: true, // NoEmitOnErrorsPlugin
    concatenateModules: true, //ModuleConcatenationPlugin
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: !COMPRESS,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          output: {
            ecma: 5,
          },
        },
      }),
    ]
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', {
              modules: false,
            }],
            ['stage-2'],
          ],
          plugins: [
            ['transform-react-jsx'],
            ['react-hot-loader/babel'],
          ],
        },
      },
    }, {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    }, {
      test: /\.coffee?$/,
      use: 'coffee-loader',
    }, {
      test: /\.worker\.js$/,
      use: {
        loader: 'worker-loader',
      },
    }, {
      test: /\.s?css$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: !COMPRESS
          }
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: !COMPRESS,
            plugins: [
              autoprefixer()
            ]
          }
        }, {
          loader: 'resolve-url-loader'
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: !COMPRESS
          }
        }, ]
      })
    }, {
      test: /fontawesome([^.]+).(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/',
          publicPath: '../fonts/'
        }
      }]
    }, {
      test: /\.(ttf|otf|eot|svg|woff(2)?)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/',
          publicPath: '../fonts/'
        }
      }]
    }, {
      test: /\.(png|jpg|jpeg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'img/',
        publicPath: '../img/'
      },
    }, ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
    ],
    alias: {
      'jquery': require.resolve('jquery'),
      'jQuery': require.resolve('jquery'),
    },
  },
  plugins: plugins,

  devServer: {
    host: '127.0.0.1',
    port: 8001,
    historyApiFallback: true,
    hot: false,
    clientLogLevel: 'info',
    contentBase: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'dist'),
    ],
    //watchContentBase: true,
    overlay: {
      warnings: true,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
};
