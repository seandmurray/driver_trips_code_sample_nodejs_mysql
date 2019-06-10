/*jshint esversion: 6 */

// This object formats and prints the reports data.

const stream = require("stream");

// This is a library I wrote and is on github/npmjs.
const isit = require("prose_isit");

module.exports = class extends stream.Writable {
	constructor(options) {
		super(options);
	}

	_write(chunk, encoding, callback) {
		if (isit.notNil(chunk) && isit.notNil(chunk.name)) {
			console.log(chunk.name + ':\t0 miles');
		}
		callback();
	}

};
