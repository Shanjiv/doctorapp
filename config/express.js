'use strict';

// Module dependencies
var express = require('express');
var consolidate = require('consolidate');
var	path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');

var config = require('./config');

module.exports = function () {

		// Initialize Express app
		var app = express();

		// Local variables
		app.locals.title = config.app.locals.title;
		app.locals.description = config.app.locals.description;
		app.locals.keywords = config.app.locals.keywords;

		app.locals.jsHeadFiles = config.getJsHeadFiles();
		app.locals.jsHeaderFiles = config.getJsHeaderFiles();
		app.locals.jsFooterFiles = config.getJsFooterFiles();
		app.locals.cssHeadFiles = config.getCssHeadFiles();
		app.locals.cssHeaderFiles = config.getCssHeaderFiles();
		app.locals.cssFooterFiles = config.getCssFooterFiles();

		// Set swig as the template engine
		app.engine('server.view.html', consolidate[config.templateEngine]);

		// Set views path and view engine
		app.set('view engine', 'server.view.html');
		app.set('views', './app/views');

		app.use(bodyParser.urlencoded({
				'extended':'true'
		}));
		app.use(bodyParser.json());
		app.use(methodOverride());

		// Set static folder path
		app.use(express.static(path.resolve('./public')));

		// =============================
		/* Routes Handling */
		//==============================
		require(path.resolve('app/routes/core.server.routes.js'))(app);

		// =============================
		/* Error Handling */
		//==============================
		// Showing stack errors
		app.set('showStackError', true);

		// Error 500 - Something blew up
		app.use(function (err, req, res, next) {
				// If the error object doesn't exist return next()
				if (!err)
						return next();

				// Otherwise log the error ...
				console.error(err.stack);

				// ... and render the error page
				res.status(500).render('500', {
						error: err.stack})
		});

		// Error 404 - Page not found
		// At this point we are assuming error 404 since no middleware responded
		app.use(function (req, res) {
				res.status(404).render('404', {
						url: req.originalUrl,
						error: 'Not Found!'
				});
		});

		return app;
};