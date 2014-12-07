'use strict';

// Root route
module.exports = function(app) {
		var CoreController = require('../controllers/core.server.controller');
		app.route('/').get(CoreController.index);
};