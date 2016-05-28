var webpack = require('webpack');
var path = require('path');
var WebpackDevServer = require('webpack-dev-server');
var optimist = require('optimist');
require('webpack/bin/config-optimist')(optimist);

var argv = optimist.argv;
argv.progress = true;
// argv.profile = true;
// argv.json = true;
var cliOptions = require('webpack/bin/convert-argv')(optimist, argv);

var PRODUCTION = process.env.NODE_ENV === 'production';
var STANDALONE = process.env.BUILD_TARGET === 'standalone';

var statsOptions = {
    assets: false,
    colors: true,
    version: false,
    modules: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
    reasons : true,
    cached : true,
    chunkOrigins : true
};

var devServerConfing = {
    publicPath: '/',
    contentBase: './dist',
    historyApiFallback: false,
    inline: !STANDALONE,
    hot: !STANDALONE,
    stats: statsOptions,
    // proxy: {
        // '*': 'http://localhost:8081'
    // }
};

if (!STANDALONE) {
    cliOptions.entry.index.unshift('webpack/hot/only-dev-server');
    cliOptions.entry.index.unshift('webpack-dev-server/client?http://localhost:8080');
}

// webpack(cliOptions).run(function (err, stats) {
//     console.log(stats.toString({
//         colors: true,
//     }));
//     require('fs').writeFileSync('stats.json', JSON.stringify(stats.toJson(), null, 4))
// });

new WebpackDevServer(webpack(cliOptions), devServerConfing).listen(8080, 'localhost', function (err, result) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Webpack dev server listening at localhost:8080');
    }
});
