const COMPRESS = true;

const conf = {
	APPDIR: '',
	SRC: 'src',
	DIST: 'dist',
	webp: false,
};

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const filesystem = require('fs');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ImageminPlugin = require('image-minimizer-webpack-plugin');
const ImageSpritePlugin = require('@a2nt/image-sprite-webpack-plugin');

const UIInfo = require('./package.json');
const UIMetaInfo = require('./node_modules/@a2nt/meta-lightbox/package.json');

console.log('WebP images: ' + conf['webp']);

const plugins = [
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('production'),
		},
	}),
	new webpack.LoaderOptionsPlugin({
		minimize: COMPRESS,
		debug: false,
	}),
	new MiniCssExtractPlugin({
		filename: 'css/[name].css',
		//allChunks: true,
	}),
	/**/
	new HtmlWebpackPlugin({
		template: path.join(conf.APPDIR, conf.SRC, 'index.html'),
	}),
	new webpack.DefinePlugin({
		UINAME: JSON.stringify(UIInfo.name),
		UIVERSION: JSON.stringify(UIInfo.version),
		UIAUTHOR: JSON.stringify(UIInfo.author),
		UIMetaNAME: JSON.stringify(UIMetaInfo.name),
		UIMetaVersion: JSON.stringify(UIMetaInfo.version),
	}),
];

if (COMPRESS) {
	plugins.push(
		new OptimizeCssAssetsPlugin({
			//assetNameRegExp: /\.optimize\.css$/g,
			cssProcessor: require('cssnano'),
			cssProcessorPluginOptions: {
				preset: ['default'],
			},
			cssProcessorOptions: {
				zindex: true,
				cssDeclarationSorter: true,
				reduceIdents: false,
				mergeIdents: true,
				mergeRules: true,
				mergeLonghand: true,
				discardUnused: true,
				discardOverridden: true,
				discardDuplicates: true,
				discardComments: {
					removeAll: true,
				},
			},
			canPrint: true,
		}),
	);
	plugins.push(require('autoprefixer'));

	plugins.push(
		new ImageminPlugin({
			minimizerOptions: {
				// Lossless optimization with custom option
				// Feel free to experiment with options for better result for you
				plugins: [
					['gifsicle', { interlaced: true }],
					['jpegtran', { progressive: true }],
					['optipng', { optimizationLevel: 5 }],
					[
						'svgo',
						{
							plugins: [
								{
									removeViewBox: false,
								},
							],
						},
					],
				],
			},
		}),
	);

	plugins.push(
		new ImageSpritePlugin({
			exclude: /exclude|original|default-|icons|sprite/,
			commentOrigin: false,
			compress: true,
			extensions: ['png'],
			indent: '',
			log: true,
			//outputPath: path.join(__dirname, conf.APPDIR, conf.DIST),
			outputFilename: 'img/sprite-[hash].png',
			padding: 0,
		}),
	);
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

	const _getAllFilesFromFolder = function (dir, includeSubFolders = true) {
		const dirPath = path.resolve(__dirname, dir);
		let results = [];

		filesystem.readdirSync(dirPath).forEach((file) => {
			if (file.charAt(0) === '_') {
				return;
			}

			const filePath = path.join(dirPath, file);
			const stat = filesystem.statSync(filePath);

			if (stat && stat.isDirectory() && includeSubFolders) {
				results = results.concat(
					_getAllFilesFromFolder(filePath, includeSubFolders),
				);
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

_addAppFiles(path.join(conf.APPDIR, conf.SRC));

module.exports = {
	entry: includes,
	recordsPath: path.join(__dirname, conf.APPDIR, conf.DIST, 'records.json'),
	cache: {
		type: 'filesystem',
	},
	output: {
		publicPath: path.join(conf.APPDIR),
		path: path.join(__dirname, conf.APPDIR, conf.DIST),
		filename: path.join('js', '[name].js'),
	},
	externals: {
		jquery: 'jQuery',
	},
	optimization: {
		splitChunks: {
			name: 'vendor',
			minChunks: 2,
		},
		concatenateModules: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					parse: {
						// we want terser to parse ecma 8 code. However, we don't want it
						// to apply any minfication steps that turns valid ecma 5 code
						// into invalid ecma 5 code. This is why the 'compress' and 'output'
						// sections only apply transformations that are ecma 5 safe
						// https://github.com/facebook/create-react-app/pull/4234
						ecma: 8,
					},
					compress: {
						ecma: 5,
						warnings: false,
						// Disabled because of an issue with Uglify breaking seemingly valid code:
						// https://github.com/facebook/create-react-app/issues/2376
						// Pending further investigation:
						// https://github.com/mishoo/UglifyJS2/issues/2011
						comparisons: false,
					},
					mangle: {
						safari10: true,
						/*keep_fnames: true,
						keep_classnames: true,
						reserved: ['$', 'jQuery', 'jquery'],*/
					},
					output: {
						ecma: 5,
						comments: false,
						// Turned on because emoji and regex is not minified properly using default
						// https://github.com/facebook/create-react-app/issues/2488
						ascii_only: true,
					},
				},
				// Use multi-process parallel running to improve the build speed
				// Default number of concurrent runs: os.cpus().length - 1
				parallel: true,
			}),
		],
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				//exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'], //Preset used for env setup
						plugins: [['@babel/transform-react-jsx']],
						cacheDirectory: true,
						cacheCompression: false,
					},
				},
			},
			{
				test: /\.worker\.js$/,
				use: {
					loader: 'worker-loader',
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
							sourceMap: !COMPRESS,
						},
					},
				],
			},
			{
				test: /fontawesome([^.]+).(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/',
							publicPath: '../fonts/',
						},
					},
				],
			},
			{
				test: /\.(ttf|otf|eot|svg|woff(2)?)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/',
							publicPath: '../fonts/',
						},
					},
				],
			},
			{
				test: /\.(png|webp|jpg|jpeg|gif|svg)$/,
				use: [
					{
						loader: 'img-optimize-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'img/',
							publicPath: '../img/',
							compress: {
								// This will take more time and get smaller images.
								mode: 'low', // 'lossless', 'high', 'low'
								disableOnDevelopment: true,
								webp: conf['webp'],
							},
							inline: {
								limit: 1,
							},
						},
					},
				],
			},
		],
	},
	resolve: {
		modules: [
			path.resolve(__dirname, 'src'),
			path.resolve(__dirname, 'node_modules'),
		],
		alias: {
			jquery: require.resolve('jquery'),
			jQuery: require.resolve('jquery'),
		},
		fallback: { url: false, events: false },
	},
	plugins: plugins,

	devServer: {
		host: '127.0.0.1',
		port: 8001,
		historyApiFallback: true,
		hot: false,
		/*clientLogLevel: 'info',
		contentBase: [
			path.resolve(__dirname, 'src'),
			path.resolve(__dirname, 'node_modules'),
			path.resolve(__dirname, 'dist'),
		],*/
		//watchContentBase: true,
		overlay: {
			warnings: true,
			errors: true,
		},
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	},
};
