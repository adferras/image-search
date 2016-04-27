/*jslint node: true */
'use strict';

var path = require('path');

module.exports = function (app) {

	app.route('/')
		.get(function (req, res) {
			res.sendFile('index.html');
		});

	app.route('/api')
		.get(function (req, res) {
			res.sendFile('index.html', { root: './view' });
		});

	app.route('/api/imagesearch')
		.get(function (req, res) {
			res.sendFile('index.html', { root: './view' });
		});
};
