const SOURCEDIR = './src';
const COMPRESS = false;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const filesystem = require('fs');


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

const includes = {};

const _addAppFiles = (theme) => {

  const dirPath = path.resolve(__dirname, theme);
  const themeName = path.basename(theme);

  if (filesystem.existsSync(path.join(dirPath, 'js', 'app.js'))) {
    includes['app'] = path.join(dirPath, 'js', 'app.js');
  } else if (filesystem.existsSync(path.join(dirPath, 'scss', 'app.scss'))) {
    includes['app'] = path.join(dirPath, 'scss', 'app.scss');
  }

  const _getAllFilesFromFolder = function(dir, includeSubFolders = true) {
    const dirPath = path.resolve(__dirname, dir);
    let results = [];

    filesystem.readdirSync(dirPath).forEach((file) => {
      if (file.charAt(0) === '_') {
        return;
      }

      const filePath = path.join(dirPath, file);
      const stat = filesystem.statSync(filePath);

      if (stat && stat.isDirectory() && includeSubFolders) {
        results = results.concat(_getAllFilesFromFolder(filePath, includeSubFolders));
      } else {
        results.push(filePath);
      }
    });

    return results;
  };

  // add page specific scripts
  const typesJSPath = path.join(theme, 'js/types');
  if (filesystem.existsSync(typesJSPath)) {
    const pageScripts = _getAllFilesFromFolder(typesJSPath, true);
    pageScripts.forEach((file) => {
      includes[`app_${path.basename(file, '.js')}`] = file;
    });
  }

  // add page specific scss
  const typesSCSSPath = path.join(theme, 'scss/types');
  if (filesystem.existsSync(typesSCSSPath)) {
    const scssIncludes = _getAllFilesFromFolder(typesSCSSPath, true);
    scssIncludes.forEach((file) => {
      includes[`app_${path.basename(file, '.scss')}`] = file;
    });
  }
};

_addAppFiles(SOURCEDIR);

// remove unnecessary elements for the demo
delete includes['app_cms'];
delete includes['app_editor'];
delete includes['app_order'];

module.exports = {
  entry: includes,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: path.join('js', '[name].js'),
    publicPath: path.resolve(__dirname, 'dist'),
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
