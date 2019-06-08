const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  devtool: 'source-map',
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
      new UglifyJSPlugin({
        uglifyOptions: {
          sourceMap: false,
          comments: false
        }
      })
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
            sourceMap: false,
            minimize: true
          }
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: false,
            plugins: [
              autoprefixer({
                // If we want to use the same browser list for more tools
                // this list should be moved to package.json
                // https://evilmartians.com/chronicles/autoprefixer-7-browserslist-2-released
                browsers: [
                  'ie >= 11',
                  'ie_mob >= 11',
                  'Safari >= 10',
                  'Android >= 4.4',
                  'Chrome >= 44', // Retail
                  'Samsung >= 4'
                ]
              })
            ]
          }
        }, {
          loader: 'resolve-url-loader'
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: false
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].css',
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
  ],

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
