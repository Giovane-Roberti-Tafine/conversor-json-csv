const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
// const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

module.exports = {
    devtool: 'eval-source-map',
    entry: './src/js/index.ts',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')],
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                    // 'style-loader'
                ]
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            // {
            //     test: /\.(eot|ttf|otf)(\?.*)?$/,
            //     loader: 'file-loader',
            //     options: {
            //         limit: 10000,
            //         name: '[name].[ext]',
            //         outputPath: '/fonts/',    // where the fonts will go
            //         publicPath: '/assets'       // override the default path
            //     }
            // }
            {
                test: /\.(ttf|eot|svg|gif|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [{
                    loader: 'file-loader',
                }]
            },
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: ['@babel/preset-env']
            //         }
            //     }
            // },
            // new MergeIntoSingleFilePlugin({
            //     files: {
            //         'bundle.js': [
            //             'node_modules/jquery/**/*.min.js',
            //             'node_modules/popper.js/dist/popper.min.js',
            //             'node_modules/file-saver/FileSaver.min.js'
            //         ],
            //         'style.css': [
            //             'src/styles/stylesheet.scss'
            //         ]
            //     }
            // })
        ]
    },
    output: {
        // publicPath: 'public',
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    resolve: {
        extensions: ['.js', '.tsx', '.ts']
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'stylesheet.css',
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            Popper: ['popper.js', 'default'],
        }),
    ]
};