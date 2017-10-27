var path = require('path');
var express = require('express');
var app = express();
var PORT = process.env.PORT || 4541

var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpack = require('webpack');
var config = require('./webpack.config-dev');
var compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
	noInfo: true,
	publicPath: config.output.publicPath,
	stats: {
		colors: true
	}
}))
app.use(webpackHotMiddleware(compiler, {
	stats: {
		colors: true
    }
}))

let publicPath = path.join(__dirname, 'build')
app.use(express.static(publicPath))
app.get('/', function (request, response) {
    response.sendFile('index-dev.html', {
        root: publicPath
    })
})

app.listen(PORT, function (error) {
    if (error) {
        console.error(error);
    } else {
        console.info("==> Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    }
});