/*
 * Development assets generation
 */

const path = require('path');
//const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./webpack.config.common.js');
const commonVariables = require('./webpack.configuration');
const conf = commonVariables.configuration;

const IP = process.env.IP || conf.HOSTNAME;
const PORT = process.env.PORT || conf.PORT;

const UIInfo = require('./package.json');
const UIVERSION = JSON.stringify(UIInfo.version);
const UIMetaInfo = require('./node_modules/@a2nt/meta-lightbox-react/package.json');

const NODE_ENV = 'development'; //conf.NODE_ENV || process.env.NODE_ENV;
const COMPRESS = NODE_ENV === 'production' ? true : false;

console.log('NODE_ENV: ' + NODE_ENV);
console.log('COMPRESS: ' + COMPRESS);
console.log('WebP images: ' + conf['webp']);
console.log('GRAPHQL_API_KEY: ' + conf['GRAPHQL_API_KEY']);

const config = merge(common, {
  mode: 'development',

  entry: {
    /*hot: [
      'react-hot-loader/patch',
      'webpack-dev-server/?https://' + conf.HOSTNAME + ':' + conf.PORT,
      'webpack/hot/only-dev-server',
    ],*/
  },

  output: {
    path: path.join(__dirname),
    filename: '[name].js',
    // necessary for HMR to know where to load the hot update chunks
    publicPath: 'http://' + conf.HOSTNAME + ':' + conf.PORT + '/',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        //exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/react',
              {
                plugins: [
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-syntax-top-level-await',
                ],
              },
            ], //Preset used for env setup
            plugins: [
              ['@babel/transform-react-jsx'],
              ['@babel/plugin-syntax-top-level-await'],
            ],
            cacheDirectory: true,
            cacheCompression: true,
          },
        },
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: !COMPRESS,
            },
          },
          {
            loader: 'resolve-url-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },
      {
        test: /fontawesome([^.]+).(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
      {
        test: /\.(gif|png|jpg|jpeg|ttf|otf|eot|svg|webp|woff(2)?)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name(file) {
                return 'public/[path][name].[ext]';
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      react: 'React',
      'react-dom': 'ReactDOM',
      /*$: 'jquery',
      jQuery: 'jquery',
      Popper: ['popper.js', 'default'],
      Util: 'exports-loader?Util!bootstrap/js/dist/util',
      Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
      Button: 'exports-loader?Button!bootstrap/js/dist/button',
      Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
      Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
      Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
      Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
      Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
      Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
      Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
      Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',*/
    }),
    new webpack.DefinePlugin({
      UINAME: JSON.stringify(UIInfo.name),
      UIVERSION: UIVERSION,
      UIAUTHOR: JSON.stringify(UIInfo.author),
      UIMetaNAME: JSON.stringify(UIMetaInfo.name),
      UIMetaVersion: JSON.stringify(UIMetaInfo.version),
      GRAPHQL_API_KEY: JSON.stringify(conf['GRAPHQL_API_KEY']),
      SWVERSION: JSON.stringify(`sw-${new Date().getTime()}`),
      BASE_HREF: JSON.stringify(`http://${IP}:${PORT}`),
    }),
    //new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      publicPath: '',
      template: path.join(conf.APPDIR, conf.SRC, 'index.html'),
      templateParameters: {
        NODE_ENV: NODE_ENV,
        GRAPHQL_URL: conf['GRAPHQL_URL'],
        STATIC_URL: conf['STATIC_URL'],
        REACT_SCRIPTS:
          NODE_ENV === 'production'
            ? '<script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script><script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>'
            : '<script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script><script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>',
      },
    }),
  ],

  devServer: {
    host: IP,
    port: PORT,
    historyApiFallback: false,

    // uncomment it to test caching service worker
    //injectClient: false,

    overlay: {
      warnings: true,
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'service-worker-allowed': '/',
    },
  },
});

module.exports = config;
