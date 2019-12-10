#!/usr/bin/env node

var path = require("path");
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware');
var express = require("express");
var app = express();
var proxyMiddleware = require('http-proxy-middleware');
var baseConfigFn = require("./config/webpack.config.base.js");
var baseDir = process.cwd(); //当前项目目录
var srcDir = path.resolve(baseDir, 'src'); //源码目录
module.exports = async function (params) {
	if (params.root) {
		srcDir = path.resolve(params.root, 'src');
	}
	var env = params.env || (process.env.NODE_ENV || "dev");
	process.env.NODE_ENV = env;
	baseConf = await baseConfigFn(params);
	if (env == "dev") {
		var port = params.port || 3333;
		for (var key in baseConf.entry) {
			baseConf.entry[key].unshift(`webpack-hot-middleware/client?reload=true`);
		}
		baseConf.profile = true;
		var compiler = webpack(baseConf);
		var proxy = params.proxy.context || [];
		var proxyOpts = params.proxy.options || {}
		var proxy1 = proxyMiddleware(proxy, proxyOpts);
		var devMiddleware = webpackDevMiddleware(compiler, {
			publicPath: baseConf.output.publicPath,
			//debug: true,
			hot: true,
			lazy: false,
			historyApiFallback: true,
			//poll: true,
			//index: "index.html",
			/* watchOptions: {
					aggregateTimeout: 300,
					ignored: /node_modules/
					//poll: true
			}, */
			// 输出信息 https://www.webpackjs.com/configuration/stats/
			// stats: {
			// 	chunks: false,
			// 	colors: true,
			// }
			stats: "minimal"
		});
		var hotMiddleware = webpackHotMiddleware(compiler);

		app.use(proxy1);
		app.use(devMiddleware);
		app.use(hotMiddleware);

		let listenStr = `listen at http://localhost:${port},......`;
		console.log(listenStr.bold.green);
		//console.log(listenStr.bold.cyan);                          
		app.listen(port);

		/* browserSync({
			port: port,
			server: {
				baseDir: srcDir,
				index: "index.html",
				middleware: [
					proxy1,
					devMiddleware,
					// bundler should be the same as above
					hotMiddleware
				]
			},
			// no need to watch '*.js' here, webpack will take care of it for us,
			// including full page reloads if HMR won't work
			files: [
				srcDir + '/*.html'
			]
		}); */


	} else {
		var compiler = webpack(baseConf, function (err, stats) {
			if (err || stats.hasErrors()) {
				if (err) {
					console.error(err.stack || err);
					if (err.details) {
					  console.error(err.details);
					}
					return;
				}
				if (stats.hasErrors()) {
					console.log(stats.compilation.errors);
				}
				console.log(('编译出错,请仔细检查！！！').bold.red);
				process.exit();
			} else {
				if(params.mode == 'serve'){ // 对build后的文件开启serve服务
					var proxy1 = proxyMiddleware(params.proxy.context, {
						target: params.proxy.options.target
					});
					app.use(proxy1);
					app.use(express.static(`${baseDir}/${params.build}`));
					let listenStr = `listen at http://localhost:${params.servePort},......`;
					console.log(listenStr.bold.cyan);
					app.listen(params.servePort);
				}
			}
		});
	}
};
