/**
 * 设置版本号，配置参考:
 * https://cli.vuejs.org/zh/config/
 */
const packageInfo = require('./package.json');
// const url = 'http://localhost:9999'
// const url = 'http://lzyq-gateway:9999'
// const url = 'http://192.168.2.103:9997'
// const url = 'http://s2.z100.vip:10694'
// const url = 'http://pd.zhiboniu.cn'
// const url = 'http://xianghuoerp.com/'
const url = 'http://dppt.damaijia.co/'
// const url = 'http://yunpaipai.com.cn/'


/**
 * 主题定义以及编译生成
 * 有多少个主题变量的文件，就会对经过编译器的 sass 文件进行编译多少次，
 * 所以 multipleScopeVars 项越多，必然会增加编译时间，
 * 建议在开发模式只提供一个变量文件，在需要调试切换主题或生产模式时就提供完整的变量文件个数进行打包。
 */
const path = require('path');
const { getSass } = require('@zougt/some-loader-utils');
// const ThemeCssExtractWebpackPlugin = require('@zougt/theme-css-extract-webpack-plugin');

const multipleScopeVars = [
    {
        scopeName: 'theme-default',
        path: path.resolve('src/styles/themeVars/default-vars.scss'),
    },
    {
        scopeName: 'theme-white',
        path: path.resolve('src/styles/themeVars/white-vars.scss'),
    },
    {
        scopeName: 'theme-yellow',
        path: path.resolve('src/styles/themeVars/yellow-vars.scss'),
    },
    {
        scopeName: 'theme-d2',
        path: path.resolve('src/styles/themeVars/d2-vars.scss'),
    },
    {
        scopeName: 'theme-hey',
        path: path.resolve('src/styles/themeVars/hey-vars.scss'),
    },
    {
        scopeName: 'theme-iview',
        path: path.resolve('src/styles/themeVars/iview-vars.scss'),
    },
    {
        scopeName: 'theme-star',
        path: path.resolve('src/styles/themeVars/star-vars.scss'),
    },
];
// --------------

const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
module.exports = {
    pages: {
        // https://cli.vuejs.org/zh/config/#vue-config-js
        app: {
            // page 的入口
            entry: 'src/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            meta: { revised: `${packageInfo.version}` },
        },
    },
    lintOnSave: true,
    productionSourceMap: false,
    chainWebpack: config => {
        const entry = config.entry('app')
        entry
            .add('babel-polyfill')
            .end()
        entry
            .add('classlist-polyfill')
            .end()
    },
    css: {
        // 忽略 CSS order 顺序警告
        extract: { ignoreOrder: true },
        loaderOptions: {
            scss: {
                // 这里的选项会传递给 sass-loader
                implementation: getSass({
                    // getMultipleScopeVars优先于 sassOptions.multipleScopeVars
                    getMultipleScopeVars: (sassOptions) => multipleScopeVars.map((item) => {
                        return { ...item, path: path.resolve(item.path) };
                    }),
                }),
            },
        },

    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // 仅在生产环境下启用该配置
            return {
                performance: {
                    // 打包后最大文件大小限制
                    maxAssetSize: 1024000
                },
                plugins: [
                    new CompressionWebpackPlugin({
                        filename: '[path].gz[query]',
                        algorithm: 'gzip',
                        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                        threshold: 1024, // 只有大小大于该值的资源会被处理,当前配置为对于超过1k的数据进行处理，不足1k的可能会越压缩越大
                        minRatio: 0.99, // 只有压缩率小于这个值的资源才会被处理
                        deleteOriginalAssets: true // 删除原文件
                    })
                ],
            }
        }
    },
    // 配置转发代理
    devServer: {
        disableHostCheck: true,
        port: 8081,
        proxy: {
            '/': {
                target: url,
                ws: false, // 需要websocket 开启
                pathRewrite: {
                    '^/': '/'
                }
            }
            // 3.5 以后不需要再配置
        }
    }
}
