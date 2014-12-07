'use strict';

var config = require('./config/config');
var assets = require('./config/assets.json');

module.exports = function(grunt) {

		grunt.initConfig({

				// Uglify distribution javascripts
				//=======================================
				uglify: {
						lib: {
								options: {
										mangle: true,
										compress: true
								},
								files: [
										assets.lib.js.head,
										assets.lib.js.header,
										assets.lib.js.footer
								]
						},
						app: {
								files: [
										assets.app.js.head,
										assets.app.js.header,
										assets.app.js.footer
								]
						}
				},

				// Minify distribution stylesheets
				//=======================================
				cssmin: {
						lib: {
								files: assets.lib.css.head
						},

						app: {
								files: assets.app.css.head
						}
				},

				// Open in browser
				//=======================================
				open: {
						all: {
								// Gets the port from the connect configuration
								path: 'http://localhost:' + config.port
						}
				},

				// watch css and js files and process the allocated tasks
				//=======================================
				watch: {
						js: {
								files: ['./public/modules/**/*.js'],
								tasks: ['uglify'],
								options: {livereload: true}
						},
						html: {
								files: [
										"./app/views/**/*",
										"./public/modules/**/*"
								],
								tasks: [],
								options: {livereload: true}
						}
				},

				// watch our node server for changes
				//=======================================
				nodemon: {
						dev: {
								script: 'server.js'
						}
				},

				// run watch and nodemon at the same time
				//=======================================
				concurrent: {
						options: {
								logConcurrentOutput: true
						},
						tasks: ['nodemon', 'watch']
				}

		});

		// Load NPM tasks
		//=======================================
		// grunt.loadNpmTasks('grunt-express-server');
		grunt.loadNpmTasks('grunt-open');
		grunt.loadNpmTasks('grunt-contrib-watch');
		grunt.loadNpmTasks('grunt-contrib-cssmin');
		grunt.loadNpmTasks('grunt-contrib-uglify');
		grunt.loadNpmTasks('grunt-contrib-jshint');
		grunt.loadNpmTasks('grunt-nodemon');
		grunt.loadNpmTasks('grunt-concurrent');

		// Specify alias tasks
		//=======================================
		grunt.registerTask('default', ['open', 'concurrent']);
		grunt.registerTask('dev', ['open', 'watch']);
		grunt.registerTask('prod', [
				'cssmin',
				'uglify',
				'open',
				'watch'
		]);
		grunt.registerTask('test', ['open', 'watch']);

};