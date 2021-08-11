/*
 * Development assets generation
 */
const common = require('./webpack.config.common.js');
const conf = common.configuration;

const path = require('path');
const fs = require('fs');

//const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const {
    merge
} = require('webpack-merge');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const IP = process.env.IP || conf.HOSTNAME;
const PORT = process.env.PORT || conf.PORT;

let plugins = common.plugins;

const indexPath = path.join(__dirname, conf.APPDIR, conf.SRC, 'index.html');
if (fs.existsSync(indexPath)) {
    plugins.push(
        new HtmlWebpackPlugin({
            publicPath: '',
            template: path.join(conf.APPDIR, conf.SRC, 'index.html'),
            templateParameters: {
                NODE_ENV: 'development',
                GRAPHQL_URL: conf['GRAPHQL_URL'],
                STATIC_URL: conf['STATIC_URL'],
                REACT_SCRIPTS: '<script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script><script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>',
            },
        }),
    );
}

const config = merge(common.webpack, {
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
        publicPath: `http${conf['HTTPS'] ? 's' : ''}://${conf['HOSTNAME']}:${conf.PORT}/`,
    },

    module: {
        rules: [{
            test: /\.jsx?$/,
            //exclude: /node_modules/,
            use: {
                loader: '@sucrase/webpack-loader', //'babel-loader',
                options: {
                    transforms: ['jsx'],
                    /*presets: [
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
                    cacheCompression: true,*/
                },
            },
        },
        {
            test: /\.s?css$/,
            use: [{
                loader: MiniCssExtractPlugin.loader,
            },
            {
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                },
            },
            {
                loader: 'resolve-url-loader',
            },
            {
                loader: 'sass-loader',
                options: {
                    sourceMap: true,
                },
            }, ],
        },
        {
            test: /fontawesome([^.]+).(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
            type: "asset/resource",
        },
        {
            test: /\.(gif|png|jpg|jpeg|ttf|otf|eot|svg|webp|woff(2)?)$/,
            type: "asset/resource",
        }, {
            test: /\.(png|webp|jpg|jpeg|gif|svg)$/,
            type: "asset/resource",
        }, ],
    },
    plugins: plugins,

    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        host: IP,
        port: PORT,
        historyApiFallback: false,
        static: path.resolve(__dirname, conf['APPDIR'], conf['SRC']),
        https: conf['HTTPS'],
        hot: false, //true,
        //injectClient: conf['injectClient'],

        headers: {
            'Access-Control-Allow-Origin': '*',
            'Referrer-Policy': 'unsafe-url',
            'service-worker-allowed': '/',
        },
    },
});

module.exports = config;
