var webpack = require('webpack');
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpackConfig = require('./webpack');

var options = {
    projectRoot: __dirname,
    extractTextPlugin: {
        options: {
            disable: true
        }
    },
    define: {
    }
};

module.exports = webpackConfig(webpack, options, {
    devServer: {
        contentBase: "./dist"
    },

    entry: {
        index: [
            './src/entry.js'
        ]
    },

    output: {
        path: path.join(__dirname, 'dist/assets'),
        filename: '[name].js',
        publicPath: '/',
    },

    devtool: 'inline-source-map',
    devtoolLineToLine: [
        {
            include: path.join(__dirname, 'node_modules')
        }
    ],

    plugins: [
        new HtmlWebpackPlugin({
            title: 'ScrumBricks',
            filename: '../index.html'
        })
    ]
});
