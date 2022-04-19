"use strict";
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const url = "http://192.168.10.13:9999"; // lmq
//const url = "http://192.168.105.9:9999"; // lmq
//const url = "http://39.108.217.65:9999"; // test
//const url = 'http://192.168.105.11:9999' // dz
//const url = 'http://192.168.105.4:9999' // su
const name = "统一运营管理平台";
const CopyWebpackPlugin = require("copy-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: true,
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: "dist",
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: "static",
  productionSourceMap: false,
  css: {
    // 忽略 CSS order 顺序警告
    extract: {
      ignoreOrder: true
    }
  },
  // 配置转发代理
  devServer: {
    disableHostCheck: true,
    port: 8081,
    open: true,
    proxy: {
      "/api": {
        target: url,
        changeOrigin: true,
        ws: true, // 需要websocket 开启
        pathRewrite: {
          "^/api": "/"
        }
      }
      // 3.5 以后不需要再配置
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        "@": resolve("src")
      }
    },
    plugins: []
  },
  chainWebpack(config) {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test
    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/assets/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === "development", config =>
        config.devtool("cheap-source-map")
      );

    config.when(process.env.NODE_ENV !== "development", config => {
      config.optimization.minimizer([
        new TerserPlugin({
          cache: true,
          sourceMap: false,
          parallel: true, // 多进程
          terserOptions: {
            mangle: true, // 混淆
            output: {
              comments: false, // 去掉注释
            },
            warnings: false,
            compress: {
              drop_console: true, //传true就是干掉所有的console.*这些函数的调用.
              drop_debugger: true, //删除debugger;
              pure_funcs: ['console.log'] // 如果你要干掉特定的函数比如console.info ，又想删掉后保留其参数中的副作用，那用pure_funcs来处理
            }
          }
        })
      ]);
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [{
          // `runtime` must same as runtimeChunk name. default is `runtime`
          inline: /runtime\..*\.js$/
        }])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single");
    });
  }
};
