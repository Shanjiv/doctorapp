'use strict';

module.exports = {

		app: {
				locals: {
						title: 'Ärzte Platform',
						description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
						keywords: 'mongodb, express, angularjs, node.js, mongoose, passport'
				}
		},

		port: process.env.PORT || 3000,

		templateEngine: 'swig',

		includeTests: false

};