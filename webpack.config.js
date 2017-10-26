const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const config = {
    entry: {
        bundle: path.resolve(__dirname, 'client/app.js')
    },
    node: {
        __dirname: true
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    module: {
		noParse: [/ws/],
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }],
                exclude: /node_modules/
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: {
                    loader: "file-loader?name=../node_modules/materialize-css/fonts/roboto/[name].[ext]"
                },
                exclude: /node_modules/
            }
        ]
	},
	externals: [
		'ws'
	],
    target: 'node',
    resolve: {
        alias: {
            'node-modules': __dirname + '/node_modules',
            'react': path.join(__dirname, 'node_modules', 'react'),
            'react-dom': path.join(__dirname, 'node_modules', 'react-dom'),
            'react-router-dom': path.join(__dirname, 'node_modules', 'react-router-dom')
        }
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new UglifyJSPlugin({
            sourceMap: false,
            uglifyOptions: {
                ie8: false,
                ecma: 8,
                mangle: false,
                output: {
                    comments: false,
                    beautify: false
                }
            },
            compress: {
                warnings: false
            }
        })
    ]
}

module.exports = config