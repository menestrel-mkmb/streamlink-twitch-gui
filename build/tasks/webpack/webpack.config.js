const { resolve: r } = require( "path" );
const {
	pRoot,
	pLoaders,
	pApp,
	pAssets,
	pLocales,
	pConfig,
	pTest,
	pDependencies
} = require( "./paths" );


// default target config which each target is based on
module.exports = {
	target: "node-webkit",

	mode: "development",

	context: pApp,
	entry: "main",

	resolve: {
		alias: {
			// directory aliases
			"root": pRoot,
			"loaders": pLoaders,
			"assets": pAssets,

			// app aliases
			"config": r( pApp, "config" ),
			"data": r( pApp, "data" ),
			"init": r( pApp, "init" ),
			"locales": pLocales,
			"nwjs": r( pApp, "nwjs" ),
			"services": r( pApp, "services" ),
			"ui": r( pApp, "ui" ),
			"utils": r( pApp, "utils" )
		},
		extensions: [ ".wasm", ".mjs", ".js", ".json", ".ts" ],
		modules: [
			"web_modules",
			"node_modules"
		]
	},

	resolveLoader: {
		modules: [
			pLoaders,
			"node_modules"
		]
	},

	module: {
		rules: [],
		noParse: []
	},

	plugins: [],


	output: {
		// name each file by its entry module name
		filename: "[name].js",
		// set crossorigin attribute on resources with integrity data
		crossOriginLoading: "anonymous",
		// don't use the webpack:// protocol in sourcemaps
		devtoolModuleFilenameTemplate: "/[resource-path]"
	},

	optimization: {
		runtimeChunk: true,
		splitChunks: {
			chunks: "all",
			minSize: 0,
			maxInitialRequests: Infinity,
			cacheGroups: {
				vendor: {
					name: "vendor",
					test: pDependencies
				},
				config: {
					name: "config",
					test({ resource }) {
						return resource && (
							   resource.startsWith( pConfig )
							|| /metadata\.js$/.test( resource )
						);
					}
				},
				translation: {
					name: "translation",
					test({ resource }) {
						return resource
						    && resource.startsWith( pLocales )
						    && resource.endsWith( ".yml" );
					}
				},
				template: {
					name: "template",
					test: /\.hbs$/
				},
				test: {
					name: "test",
					test: pTest
				}
			}
		}
	},


	cache: true,
	performance: {
		hints: "warning",
		maxEntrypointSize: Infinity,
		maxAssetSize: Infinity
	},

	stats: {
		modules: false,
		chunks: false,
		chunkModules: false,
		children: false,
		timings: true,
		warnings: true,
		// FIXME: stats.warningsFilter has been deprecated in webpack 5
		warningsFilter: []
	}
};
