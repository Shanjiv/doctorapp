'use strict';

var _ = require('lodash');
var assets = require('./assets.json');
var glob = require('glob');
var path = require('path');

// Loading environment variables
module.exports = _.extend(
		require('./env/all'),
				require('./env/' + process.env.NODE_ENV) || {}
);

module.exports.getAssetsByGlobPatterns = function (globPatterns, removeFromRoot) {
		// For context switching
		var _this = this;
		// URL paths regex
		var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');
		// The output array
		var output = [];

		// If globPatterns is an array, we use each pattern in a recursive way, otherwise ...
		if (_.isArray(globPatterns)){
				globPatterns.forEach(function (globPattern) {
						output = _.union(output, _this.getAssetsByGlobPatterns(globPattern, removeFromRoot))
				});
		} else if (_.isString(globPatterns)) {
				if (urlRegex.test(globPatterns)) {
						output.push(globPatterns);
				} else {
						glob(globPatterns, {
								sync: true
						}, function (err, files) {
								if (removeFromRoot) {
										files = files.map(function (file) {
												return file.replace(removeFromRoot, '');
										});
								}
								output = _.union(output, files);
						});
				}
		}
		return output;
};


module.exports.getAssets = function (whereToInject, assetType, includeTests) {
		var globPatterns = [], libAssets = [], appAssets = [], testAssets = [];
		if (process.env.NODE_ENV === "development" || "test")
		// In development or test environments we load in all uncompressed files
		// If test files are chosen to be included they are injected to the header.
				switch (whereToInject) {
						case "head":
								if (assetType === "js") {
										libAssets = assets.lib.js.head['public/dist/head.lib.min.js'];
										appAssets = assets.app.js.head['public/dist/head.app.min.js'];
								} else if (assetType === "css") {
										libAssets = assets.lib.css.head['public/dist/head.lib.min.css'];
										appAssets = assets.app.css.head['public/dist/head.app.min.css'];
								}
								globPatterns = libAssets.concat(appAssets);
								break;
						case "header":
								if (assetType === "js") {
										libAssets = assets.lib.js.header['public/dist/header.lib.min.js'];
										appAssets = assets.app.js.header['public/dist/header.app.min.js'];
										globPatterns = libAssets.concat(appAssets);
										if (includeTests) {
												testAssets = assets.app.js.testing;
												globPatterns = globPatterns.concat(testAssets);
										}
								} else if (assetType === "css") {
										libAssets = assets.lib.css.header['public/dist/header.lib.min.css'];
										appAssets = assets.app.css.header['public/dist/header.app.min.css'];
										globPatterns = libAssets.concat(appAssets);
								}
								break;
						case "footer":
								if (assetType === "js") {
										libAssets = assets.lib.js.footer['public/dist/footer.lib.min.js'];
										appAssets = assets.app.js.footer['public/dist/footer.app.min.js'];
								} else if (assetType === "css") {
										libAssets = assets.lib.css.footer['public/dist/footer.lib.min.css'];
										appAssets = assets.app.css.footer['public/dist/footer.app.min.css'];
								}
								globPatterns = libAssets.concat(appAssets);
								break;
				}
		else if (process.env.NODE_ENV === "production")
		// In production we inject the minified, uglified, production ready files.
				switch (whereToInject) {
						case "head":
								if (assetType === "js") {
										libAssets = Object.keys(assets.lib.js.head)[0] || null;
										appAssets = Object.keys(assets.app.js.head)[0] || null;
								} else if (assetType === "css") {
										libAssets = Object.keys(assets.lib.css.head)[0] || null;
										appAssets = Object.keys(assets.app.css.head)[0] || null;
								}
								[libAssets, appAssets].forEach(function(element) {
										if (element !== null)
												globPatterns.push(element);
								});
								break;
						case "header":
								if (assetType === "js") {
										libAssets = Object.keys(assets.lib.js.header)[0] || null;
										appAssets = Object.keys(assets.app.js.header)[0] || null;
								} else if (assetType === "css") {
										libAssets = Object.keys(assets.lib.css.header)[0] || null;
										appAssets = Object.keys(assets.app.css.header)[0] || null;
								}
								[libAssets, appAssets].forEach(function(element) {
										if (element !== null)
												globPatterns.push(element);
								});
								break;
						case "footer":
								if (assetType === "js") {
										libAssets = Object.keys(assets.lib.js.footer)[0] || null;
										appAssets = Object.keys(assets.app.js.footer)[0] || null;
								} else if (assetType === "css") {
										libAssets = Object.keys(assets.lib.css.footer)[0] || null;
										appAssets = Object.keys(assets.app.css.footer)[0] || null;
								}
								[libAssets, appAssets].forEach(function(element) {
										if (element !== null)
												globPatterns.push(element);
								});
								break;
				}
		else
				throw new Error(process.env.NODE_ENV + ' is not a valid programming environment.');

		return this.getAssetsByGlobPatterns(globPatterns, 'public/');
};

module.exports.getJsHeadFiles = function () {
		return this.getAssets('head', 'js', this.includeTests);
};

module.exports.getJsHeaderFiles = function () {
		return this.getAssets('header', 'js', this.includeTests);
};

module.exports.getJsFooterFiles = function () {
		return this.getAssets('footer', 'js', this.includeTests);
};

module.exports.getCssHeadFiles = function () {
		return this.getAssets('head', 'css', this.includeTests);
};

module.exports.getCssHeaderFiles = function () {
		return this.getAssets('header', 'css', this.includeTests);
};

module.exports.getCssFooterFiles = function () {
		return this.getAssets('footer', 'css', this.includeTests);
};
