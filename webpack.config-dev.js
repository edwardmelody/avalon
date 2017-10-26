const path = require('path')
const webpack = require('webpack')

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
    target: 'node',
    resolve: {
        alias: {
            'node-modules': __dirname + '/node_modules',
            'react': path.join(__dirname, 'node_modules', 'react'),
            'react-dom': path.join(__dirname, 'node_modules', 'react-dom'),
            'react-router-dom': path.join(__dirname, 'node_modules', 'react-router-dom')
        }
    },
    devServer: {
        contentBase: './build',
        hot: true
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ]
}

module.exports = config