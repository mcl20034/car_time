const path = require("path");
const fs = require("fs");
const program = require("commander");
const pkg = require("./package.json");
const webpackBuild = require("./webpackindex");
const proxyMiddleware = require("http-proxy-middleware");
const app = require("express")();
const serverStatic = require("serve-static");
// const esLintMiddleware = require("./eslint/index.js");
const projectName = pkg.name;
const version = pkg.version;
const baseDir = process.cwd();

function getIPAdress() {
  var interfaces = require("os").networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "localhost" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}
// process.env.localIP = getIPAdress();
console.log("ip is:", process.env.localIP);
const params = {
  port: 3333,
  env: "dev",
  publicPath: `..`,
  build: `build`,
  proxy: {
    context: pkg.proxy,
    options: {
      target: "https://test.taoxiangche.com/",
      changeOrigin: true,
    },
  },
};

/* var esLintPath = [];
for (var i = 0; i < pkg.eslintFiles.length; i++) {
  esLintPath.push(path.normalize(path.join(baseDir, `/src/scripts/${pkg.eslintFiles[i]}`)));
} */

program
  .version("0.0.1")
  .option("-d, --dev", "开发环境")
  .option("-b, --build", "编译环境")
  .option("-s, --serve", "编译后运行环境")
  .parse(process.argv);
if (program.dev) {
  params.publicPath = "";
  (async function() {
    dev();
  })();
}

if (program.serve) {
  runServe();
}

if (program.build) {
  build(program.build);
}

function dev() {
  (async function() {
    await webpackBuild(params);
  })();
}

function runServe() {
  params.env = "prod";
  params.publicPath = "";
  params.build = "build";
  (async function() {
    await webpackBuild(params);
    var proxy1 = proxyMiddleware(params.proxy.context, {
      target: params.proxy.options.target,
    });
    app.use(proxy1);
    app.use(
      serverStatic(`${baseDir}/${params.build}`, {
        index: [`index.html`],
      })
    );
    let listenStr = `listen at http://localhost:8888,......`;
    console.log(listenStr.bold.cyan);
    app.listen(8888);
  })();
}

function build() {
  params.env = "prod";
  //params.serverPort = 8888;
  (async function() {
    await webpackBuild(params);
  })();
}
