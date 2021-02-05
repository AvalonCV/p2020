import path from 'path';
import webpack from 'webpack';
import WebpackNodeExternals from 'webpack-node-externals';


export interface CustomWebpackConfiguration extends webpack.Configuration {
	name: '' | 'server' | 'client';
	plugins: webpack.WebpackPluginInstance[] /* we know we use a plugin array */;
}

interface CustomProcessEnv extends NodeJS.ProcessEnv {
	NODE_ENV?: 'development' | 'production' | 'none';
}

export default function (env: CustomProcessEnv = process.env): CustomWebpackConfiguration[] {
	const is_production = env.NODE_ENV === 'production';
	const public_path = is_production ? '/public/' : '/';

	const base: CustomWebpackConfiguration = {
		mode: is_production ? 'production' : 'development',
		name: '',
		// Enable sourcemaps for debugging webpack's output.
		devtool: is_production ? 'source-map' : 'eval-cheap-module-source-map',
		output: {
			filename: '',
			// path needs to be an ABSOLUTE file path
			path: path.resolve(process.cwd(), 'dist'),
			publicPath: public_path
		},
		resolve: {
			// Add '.ts' and '.tsx' as resolvable extensions.
			extensions: ['.ts', '.tsx', '.js', '.json'],
		},
		resolveLoader: {
			alias: { 'favicon-loader': path.resolve(process.cwd(), 'src/server/webpack/faviconLoader.ts') },
			modules: ['node_modules']
		},
		module: {
			rules: [
				// All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
				{
					test: /\.tsx?$/,
					use: [
						{
							loader: 'ts-loader',
						},
					],
				},
				// {
				// 	test: /\.(gif|jpeg|jpg|png|svg)$/,
				// 	exclude: /favicon\.(gif|jpeg|jpg|png|svg)$/,
				// 	use: [
				// 		{
				// 			// loader-probe-image-size
				// 			loader: 'sharp-responsive-multi-image-loader',
				// 			options: {
				// 				context: path.resolve(__dirname, 'src'),
				// 				outputPath: 'images',
				// 				name: 'images/[name].[hash:7].[ext]',
				// 				name_prefix: 'images/[name].[hash:7]'
				// 			}
				// 		}
				// 	]
				// },
				{
					test: /favicon\.png$/,
					use: [{
						loader: 'favicon-loader',
						options: {
							path: '/',
							outputPath: public_path,
							prefix: '',
						}
					}]
				},
				{
					test: /\.(css|md)$/,
					use: [
						{
							loader: 'raw-loader'
						}
					]
				}
				// {
				// 	test: /\.(graphql|gql)$/,
				// 	exclude: /node_modules/,
				// 	loader: 'graphql-tag/loader'
				// },
				// // github.com/kangax/html-minifier/issues/727
				// {
				// 	test: [
				// 		path.resolve(__dirname, 'node_modules/uglify-js/tools/node.js'),
				// 		path.resolve(__dirname, 'node_modules/express/lib/view.js')
				// 	],
				// 	loader: 'null-loader'
				// }
			],
		},
		plugins: [
			/* new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }) */
		],
		watchOptions: { poll: 2000, aggregateTimeout: 500 },
	};

	return [
		{
			// server-specific configuration
			...base,
			name: 'server',
			externals: [WebpackNodeExternals()],
			entry: is_production ? ['./src/server/index.prod.ts'] : ['./src/server/serverRenderer.ts'],
			target: 'node',
			output: {
				...base.output,
				filename: 'server/js/server.js',
				libraryTarget: 'commonjs2',
			},
			plugins: base.plugins,
		},
		{
			// client-specific configuration
			...base,
			name: 'client',
			entry: is_production ? ['./src/app/index.tsx'] : ['webpack-hot-middleware/client', './src/app/index.tsx'],
			target: 'web',
			output: {
				...base.output,
				filename: 'client/js/client.js',
			},

			plugins: [
				...base.plugins,
				...(is_production ? [] : [new webpack.HotModuleReplacementPlugin()])
			]
		},
	];
}
