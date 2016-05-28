var SELECTOR_MATCHER = /[a-z][_][a-z]|:/;

var path = require("path");
var _ = require("lodash");
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var ExtractTextPlugin = require("extract-text-webpack-plugin");

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

module.exports = function(webpack, options, externalConfig) {
    var config = generate(webpack, options);
    var finalExternalConfig = typeof externalConfig == 'function'
        ? externalConfig({
            ExtractTextPlugin: ExtractTextPlugin
        })
        : externalConfig;
    _.mergeWith(config, finalExternalConfig, customizer);
    return config;
}

module.exports.generate = generate;

function generate(webpack, options) {
    var standalone = process.env.BUILD_TARGET === 'standalone';
    options = _.defaultsDeep(_.cloneDeep(options), {
        projectRoot: __dirname,
        standalone: standalone,
        uglify: !!process.env.BUILD_UGLIFY,
        fork: !process.env.SKIP_FORK,
        externalReact: false,
        extractTextPlugin: {
            fileName: 'app.css',
            options: {
                allChunks: true,
                disable: !standalone
            }
        },
        define: {},
        babel: {
            include: []
        },
        postcss: {
            colorguard: false,
            importPlugin: {
                path: []
            },
            cspReactClassPrefix: {
                prefix: 'r-'
            }
        },
        atl: {
            tsconfig: path.join(__dirname, 'tsconfig.json'),
            doTypeCheck: true,
            useCache: true,
            useBabel: true,
            skipDeclarationFilesCheck: true,
        },
    });

    var config = {
        cache: true,

        externals: options.externalReact
            ? {
                "react": "React",
                "react-dom": "ReactDOM",
                "react-addons-css-transition-group": "React.addons.CSSTransitionGroup"
            }
            : {},

        bail: false,

        node: {
            fs: "empty"
        },

        resolveLoader: {
            root: (function(){
                var pathes = [
                    path.join(__dirname, "node_modules"),
                    path.join(__dirname, "bower_components"),
                    path.join(__dirname, "components")
                ];
                return pathes;
            })(),
            fallback: path.join(__dirname, "node_modules")
        },

        resolve: {
            root: (function(){
                var pathes = [
                    path.join(__dirname, "node_modules"),
                ];
                return pathes;
            })(),
            extensions: ['', '.ts', '.tsx', '.js', '.jsx'],
            alias: {

            }
        },

        module: {
            loaders: []
        },

        plugins: []
    };

    var loaders = config.module.loaders;

    if (options.babel.include.length) {
        loaders.push({
            test: /\.jsx?$/,
            loaders: [
                !options.standalone ? "react-hot" : null,
            ].filter(Boolean),
            include: options.babel.include
        });
    }

    loaders.push({
        test: /\.tsx?$/,
        loaders: [
            !options.standalone ? "react-hot-loader/webpack" : null,
            "awesome-typescript-loader?compiler=typescript"
                + (options.fork ? '&+forkChecker' : '')
                + (options.atl.doTypeCheck ? '' : '&-doTypeCheck')
                + (options.atl.skipDeclarationFilesCheck ? '&+skipDeclarationFilesCheck' : '')
                + (options.atl.tsconfig ? "&tsconfig=" + options.atl.tsconfig : '')
        ].filter(Boolean)
    });

    loaders.push({
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', "css-loader!postcss-loader")
    });

    loaders.push({
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
    });

    loaders.push({
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        exclude: [
        ]
    });

    loaders.push({
        test: /\.(jpeg|jpg|png|gif)(\?v=.*)?$/i,
        loaders: [
            'file-loader?hash=sha512&digest=hex&name=[hash].[ext]'
        ]
    });

    loaders.push({
        test: /csp-iconset\/svg\/.*[.]svg$/,
        loader: 'svg-sprite-loader'
    });

    loaders.push({
        test: /\.json?$/,
        loader: "json-loader"
    });

    var postcssImportPath = [ path.join(__dirname, 'src') ]
        .concat(options.postcss.importPlugin.path);

    config.plugins.push(
        new ForkCheckerPlugin()
    );

    config.plugins.push(
        new webpack.ProvidePlugin({
            React: "react"
        })
    );

    config.plugins.push(
        new webpack.NoErrorsPlugin()
    );

    if (!options.standalone) {
        config.plugins.push(
            new webpack.HotModuleReplacementPlugin({
                hot: true
            })
        );
    }

    config.plugins.push(
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    );

    config.plugins.push(
        new webpack.DefinePlugin(
            _.merge(
                {
                    DEBUG: process.env.NODE_ENV !== 'production',
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                    CSP_REACT_PREFIX: JSON.stringify(options.postcss.cspReactClassPrefix.prefix),
                    'process.env': {
                        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
                    }
                },
                options.define
            )
        )
    );


    if (options.uglify) {
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                minimize: true
            })
        )
    }

    config.plugins.push(
        new ExtractTextPlugin(
            options.extractTextPlugin.fileName,
            options.extractTextPlugin.options
        )
    );

    return config;
};
