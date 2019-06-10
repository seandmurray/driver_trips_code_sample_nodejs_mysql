/*jshint esversion: 6 */
const mysql = require('mysql');

// This is a library I wrote and is on github/npmjs.
const string_util = require('prose_string');

// TODO These should be in AWS parameter store.
const DB_SCHEMA = 'sdmdrivertrips';
const DB_LOGIN = DB_SCHEMA;
const DB_PASSWORD = 'tbwmrnrb';

exports.connection = () => {
	const host = process.env.DB_HOST;
	if (string_util.isBlank(host)) throw new Error('Must set a DB host as an envirnment variable: DB_HOST');
	return mysql.createConnection({
		database: DB_SCHEMA,
		host,
		password: DB_PASSWORD,
		user: DB_LOGIN
	});
};
