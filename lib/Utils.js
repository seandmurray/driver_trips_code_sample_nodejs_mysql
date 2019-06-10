/*jshint esversion: 6 */

// This is a utils lib that contains the easy to test functions
// that do the real work of parsing and validating the input data.

// These are libraries I wrote and are on github/npmjs.
const array_util = require("prose_array");
const string_util = require("prose_string");

const REGEX_MILES = /^\d+(\.\d+)?$/;
const REGEX_TIME = /^\d+(:\d+)*$/;

function invalidMiles(miles) {
	return !REGEX_MILES.test(miles);
}

function invalidTime(time) {
	return !REGEX_TIME.test(time);
}

exports.parseDriver = (data) => {
	if (array_util.notEmpty(data)) {
		const name = data.join(' ');
		if (string_util.isBlank(name)) {
			console.error('Driver name can not be blank');
		}
		else {
			return name;
		}
	}
	else {
		console.error('Driver data was invalid');
	}
	return;
};

exports.parseTrip = (data) => {
	let result;
	if (array_util.notEmpty(data) && (data.length > 3)) {
		const errors = [];
		// Order is importand. Starting at back and working to beginging
		let miles = data.pop();
		const stop = data.pop();
		const start = data.pop();
		// anything left is assumed to be a name.
		const name = data.join(' ');
		if (string_util.isBlank(name)) errors.push('Name can not be blank.');
		if (invalidTime(start)) errors.push('Invalid start time: "' + start + '".');
		if (invalidTime(stop)) errors.push('Invalid stop time: "' + stop + '".');
		if (invalidMiles(miles)) {
			errors.push('Invalid miles: "' + miles + '"');
		}
		else {
			miles = Number(miles);
		}
		if (errors.length > 0) {
			console.log(errors.join(' '));
		}
		else {
			result = { name, start, stop, miles };
		}
	}
	else {
		console.error('Invalid data');
	}
	return result;
};
