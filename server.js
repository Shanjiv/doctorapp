'use strict';

// Module dependencies
var config = require('./config/config');

// Load the express application
var app = require('./config/express')();

app.listen(config.port);
console.log('Magic happening on port ' + config.port);