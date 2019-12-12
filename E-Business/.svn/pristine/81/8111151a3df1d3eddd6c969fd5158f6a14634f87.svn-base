const resolve = require('path').resolve
const webpack = require('webpack')
const publicPath = process.env.npm_lifecycle_event === 'build' ? '/' : '/'
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 引入css 单独打包插件
const ExtractTextPlugin = require("extract-text-webpack-plugin")
// 设置生成css 的路径和文件名，会自动将对应entry入口js文件中引入的CSS抽出成单独的文件
const extractCSS = new ExtractTextPlugin('static/css/[contenthash:8].css')
const extractLESS = new ExtractTextPlugin('static/css/[contenthash:8].css')
const url = require('url')

console.log('publicPath:', publicPath)

module.exports = (options = {}) =>
    ({
        entry: {
            vendor: './src/vendor',
            index: ['babel-polyfill', './src/assets/js/qiniu.min.js', './src/main.js']
        },
        output: {
            path: resolve(__dirname, 'dist'),
            filename: options.dev ? '[name].js' : 'static/[chunkhash:8].js', //?[chunkhash]
            chunkFilename: options.dev ? '[id].js' : 'static/[chunkhash:8].js', //?[chunkhash]
            publicPath: options.dev ? '/' : publicPath
        },
        resolve: {
            extensions: ['.js', '.vue', '.css', '.json'],
            alias: {
                '~': resolve(__dirname, 'src'),
                package: resolve(__dirname, './package.json'),
                src: resolve(__dirname, './src'),
                views: resolve(__dirname, './src/views'),
                assets: resolve(__dirname, './src/assets'),
                components: resolve(__dirname, './src/components'),
                // vue-addon
                // 'vuex-store': resolve(__dirname, './src/store')
            }
        },
        module: {
            rules: [{
                test: /\.vue$/,
                use: ['vue-loader']
            }, {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            }, /*{
                  test: /\.css$/,
                  use: ['style-loader', 'css-loader', 'postcss-loader']
                },*/ {
                test: /\.css$/,
                use: extractCSS.extract(['css-loader', 'postcss-loader'])/*'style-loader!css-loader'*/
            }, {
                test: /\.less$/,
                use: extractLESS.extract(['css-loader', 'postcss-loader', 'less-loader'])/*'style-loader!css-loader!less-loader'*/
            }, {
                test: /\.html$/,
                loader: 'html-loader'
            }, {
                test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: 'static/images/[hash:8].[ext]',
                        limit: 10000
                    }
                }]
            }, {
                test: /\.(otf|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: 'static/fonts/[hash:8].[ext]',
                        limit: 10000
                    }
                }]
            }]
        },
        plugins: [
            extractCSS,
            extractLESS,
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest']
            }),
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                favicon: 'src/assets/favicon.png',
            })
        ],
        devServer: {
            //https: true,
            host: 'store.ininin.com',
            //port: 443,
            //host: '127.0.0.1',
            port: 80,
            proxy: {
                '/api/': {
                    target: 'http://123.59.76.240:3000',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/api': ''
                    }
                }
            },
            historyApiFallback: {
                index: url.parse(options.dev ? '/' : publicPath).pathname
            }
        },
        devtool: options.dev ? '#eval-source-map' : '#source-map'
    })
